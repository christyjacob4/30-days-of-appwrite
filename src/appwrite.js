import Appwrite from "appwrite";
import { state } from "./store";

const profilesCollection = "60851dd82cf5c";
const postsCollection = "60851e144f170";
const sdk = new Appwrite();
sdk.setEndpoint("https://demo.appwrite.io/v1").setProject("607dd16494c6b");

export const api = {
    getAccount: async () => sdk.account.get(),
    loginWithGoogle: async () => {
        try {
            await sdk.account.createOAuth2Session(
                "google",
                "http://localhost:3000",
                "http://localhost:3000"
            );
        } catch (error) {
            throw error;
        }
    },
    login: async (mail, pass) => {
        try {
            await sdk.account.createSession(mail, pass);
            const user = await api.getAccount();
            state.update(n => {
                n.user = user;
                return n;
            });
        } catch (error) {
            state.update(n => {
                n.user = null;
                return n;
            });
            throw error;
        }
    },
    register: async (mail, pass, name) => {
        try {
            await sdk.account.create(mail, pass, name);
            await api.login(mail, pass);
        } catch (error) {
            throw error;
        }
    },
    logout: async () => {
        try {
            await sdk.account.deleteSession("current");
        } catch (error) {
            console.log(error);
        } finally {
            state.update(n => {
                n.user = null;
                return n;
            });
        }
    },
    getAvatar: name => {
        return sdk.avatars.getInitials(name);
    },
    fetchUser: async id => {
        let res = await sdk.database.listDocuments(
            profilesCollection,
            [`user=${id}`],
            1
        );
        if (res.sum > 0 && res.documents.length > 0) return res.documents[0];
        else throw Error("Not found");
    },
    createUser: async (id, name) => {
        return sdk.database.createDocument(
            profilesCollection,
            {
                user: id,
                name: name,
            },
            ["*"],
            [`user:${id}`]
        );
    },
    createPost: async (data, userId, profileId) => {
        return sdk.database.createDocument(
            postsCollection,
            data,
            ["*"],
            [`user:${userId}`],
            profileId,
            "posts",
            "append"
        );
    },
    fetchPosts: (limit, offset) => {
        return sdk.database.listDocuments(
            postsCollection,
            [],
            limit,
            offset,
            "created_at",
            "DESC",
            "int"
        );
    },
    fetchUserPosts: userId => {
        return sdk.database.listDocuments(
            postsCollection,
            [`user_id=${userId}`],
            100,
            0,
            "created_at",
            "DESC"
        );
    },
    fetchPost: id => sdk.database.getDocument(postsCollection, id),
    uploadFile: (file, userId) =>
        sdk.storage.createFile(file, ["*"], [`user:${userId}`]),
    getThumbnail: id => sdk.storage.getFilePreview(id, 1000, 600),
};
