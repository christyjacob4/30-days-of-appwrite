import Appwrite from "appwrite";
import { state } from "./store";

const sdk = new Appwrite();
sdk.setEndpoint("https://demo.appwrite.io/v1").setProject("607dd16494c6b");

export const api = {
    getAccount: async () => sdk.account.get(),
    loginWithGoogle: async () => {
        try {
            await sdk.account.createOAuth2Session('google', 'http://localhost:3000', 'http://localhost:3000');
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
            await api.login(mail, pass)
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
    }
}