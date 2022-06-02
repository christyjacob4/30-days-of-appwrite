import { Appwrite, Query } from 'appwrite';
import type { Models } from "appwrite";
import { authStore } from './stores/auth';
import { get } from 'svelte/store';
import { profileStore } from './stores/profile';

const profilesCollection = "60851dd82cf5c";
const postsCollection = "60851e144f170";
const bucketId = "default";

export type Post = {
    title: string,
    text: string,
    published: boolean,
    createdAt: number,
    profileId: string,
    cover?: string,
    readingTime?: string,
} & Models.Document;

export type Profile = {
    user: string,
    name: string,
} & Models.Document;

const sdk = new Appwrite();

sdk
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const AppwriteService = {
    createVerification: async () => {
        return await sdk.account.createVerification(`${window.location.origin}/writer/profile`);
    },

    completeEmailVerification: async (userId: string, secret: string) => {
        return await sdk.account.updateVerification(userId, secret);
    },

    createPost: async (data: any) => {
        return await sdk.database.createDocument(
            postsCollection,
            "unique()",
            data,
            ["role:all"], // Write permissions to user given automatically
        );
    },

    verifyProfile: async (userId: string, secret: string) => {
        return await sdk.account.updateVerification(userId, secret);
    },

    createProfile: async (id: string, name: string) => {
        return await sdk.database.createDocument(
            profilesCollection,
            "unique()",
            {
                user: id,
                name: name,
            },
            ["role:all"],
            [`user:${id}`]
        );
    },

    getSelfProfile: async () => {
        try {
            const id = get(authStore)?.$id

            if (!id) {
                throw new Error("Account not found.");
            }

            const { documents: profiles } = await sdk.database.listDocuments<Profile>(
                profilesCollection,
                [Query.equal("user", id)],
                1
            );

            const profile = profiles[0];

            if (!profile) {
                throw new Error("Profile not found. Please create one first.");
            }

            profileStore.login(profile);

            return profile;
        } catch (err) {
            profileStore.logout();

            throw err;
        }
    },

    getProfileById: async (id: string) => {
        try {
            const profile = await sdk.database.getDocument<Profile>(
                profilesCollection,
                id
            );

            if (!profile) {
                throw new Error("Profile not found.");
            }

            return profile;
        } catch (err) {
            throw err;
        }
    },

    getAccount: async () => {
        try {
            const account = await sdk.account.get();
            authStore.login(account);
            return account;
        } catch (err) {
            authStore.logout();
            throw err;
        }
    },

    loginWithGoogle: async () => {
        sdk.account.createOAuth2Session(
            "google",
            window.location.origin + '/profile',
            window.location.origin + '/login'
        );
    },

    login: async (mail: string, pass: string) => {
        const session = await sdk.account.createSession(mail, pass);
        await AppwriteService.getAccount(); // Forcefully update store
        return session;
    },

    register: async (mail: string, pass: string, name: string) => {
        const account = await sdk.account.create("unique()", mail, pass, name);
        await AppwriteService.login(mail, pass);
        await AppwriteService.getAccount(); // Forcefully update store
        return account;
    },

    logout: async () => {
        await sdk.account.deleteSession("current");

        try {
            await AppwriteService.getAccount(); // Forcefully update store
        } catch (err) {
            // Ignore
        }
    },

    getThumbnail: (id: string, width: number, height: number) => {
        return sdk.storage.getFilePreview(bucketId, id, width, height)
    },

    getAvatar: (name: string = "Unnamed") => {
        return sdk.avatars.getInitials(name);
    },

    fetchUserPosts: (page: number, published: boolean) => {
        const profileId = get(profileStore)?.$id;

        if (!profileId) {
            throw new Error("Profile not found!");
        }

        return sdk.database.listDocuments<Post>(
            postsCollection,
            [Query.equal("profileId", profileId), Query.equal('published', published)],
            25,
            (page - 1) * 25,
            undefined,
            undefined,
            ["createdAt"],
            ["DESC"]
        );
    },

    fetchPosts: (page: number, published: boolean) => {
        return sdk.database.listDocuments<Post>(
            postsCollection,
            [Query.equal('published', published)],
            25,
            (page - 1) * 25,
            undefined,
            undefined,
            ["createdAt"],
            ["DESC"]
        );
    },

    deletePost: async (document: Post) => {
        if (document.cover) {
            await sdk.storage.deleteFile(bucketId, document.cover);
        }

        await sdk.database.deleteDocument(postsCollection, document.$id);
    },

    uploadFile: async (file: File) => {
        return await sdk.storage.createFile(bucketId, 'unique()', file, ['role:all']); // Write permissions to user given automatically
    }
}