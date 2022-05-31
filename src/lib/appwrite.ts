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
    cover?: string,
    text: string,
    published: boolean,
    tags?: string[],
    created_at: number,
    user_id: string,
    readingTime?: string,
} & Models.Document;

export type Profile = {
    user: string,
    name: string,
    posts?: string[]
} & Models.Document;

const sdk = new Appwrite();

sdk
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const AppwriteService = {
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

    getProfile: async (id: string | undefined = undefined) => {
        let isSelf = id === undefined;

        try {
            if (isSelf) {
                id = get(authStore)?.$id;
            }

            if (!id) {
                throw new Error("Account not found.");
            }

            const { documents: profiles } = await sdk.database.listDocuments<Profile>(
                profilesCollection,
                [Query.equal("user", id)],
                1
            );

            const profile = profiles[0]

            if (!profile) {
                throw new Error("Profile not found. Create one first please.");
            }

            if (isSelf) {
                profileStore.login(profile);
            }


            return profile;
        } catch (err) {
            if (isSelf) {
                profileStore.logout();
            }

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
            window.location.origin,
            window.location.origin
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


    fetchPosts: (limit: number, offset: number, queries: string[]) => {
        return sdk.database.listDocuments<Post>(
            postsCollection,
            queries,
            limit,
            offset,
            undefined,
            undefined,
            ["created_at"],
            ["DESC"]
        );
    },
}