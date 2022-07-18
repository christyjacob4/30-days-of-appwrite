import { Query, Client, Databases, Storage, Account, Locale, Teams, Avatars } from 'appwrite';
import type { Models } from 'appwrite';
import { authStore } from './stores/auth';
import { get } from 'svelte/store';
import { profileStore } from './stores/profile';

const profilesCollection = 'profiles';
const postsCollection = 'posts';
const commentsCollection = 'comments';
const bucketId = 'postThumbnails';
const databaseId = 'default';

export type Post = {
	title: string;
	text: string;
	published: boolean;
	createdAt: number;
	profileId: string;
	coverId: string;
	readingTime: string;
} & Models.Document;

export type Comment = {
	text: string;
	createdAt: number;
	profileId: string;
	postId: string;
} & Models.Document;

export type Profile = {
	userId: string;
	name: string;
} & Models.Document;

const client = new Client();

client
	.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
	.setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const teams = new Teams(client);
const locale = new Locale(client);
const database = new Databases(client, databaseId);
const storage = new Storage(client);
const avatars = new Avatars(client);

export const AppwriteService = {
	createVerification: async () => {
		return await account.createVerification(`${window.location.origin}/writer/profile`);
	},

	completeEmailVerification: async (userId: string, secret: string) => {
		return await account.updateVerification(userId, secret);
	},

	createPost: async (data: any) => {
		// TODO: Security issue possible
		return await database.createDocument<Post>(
			postsCollection,
			'unique()',
			data,
			['role:all'] // Write permissions to user given automatically
		);
	},

	updatePost: async (postId: string, data: any) => {
		return await database.updateDocument<Post>(postsCollection, postId, data);
	},

	verifyProfile: async (userId: string, secret: string) => {
		return await account.updateVerification(userId, secret);
	},

	createProfile: async (id: string, name: string) => {
		// TODO: Security issue possible
		return await database.createDocument<Profile>(
			profilesCollection,
			'unique()',
			{
				userId: id,
				name: name
			},
			['role:all'],
			[`user:${id}`]
		);
	},

	getSelfProfile: async () => {
		try {
			const id = get(authStore)?.$id;

			if (!id) {
				throw new Error('Account not found.');
			}

			const { documents: profiles } = await database.listDocuments<Profile>(
				profilesCollection,
				[Query.equal('userId', id)],
				1
			);

			const profile = profiles[0];

			if (!profile) {
				throw new Error('Profile not found. Please create one first.');
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
			const profile = await database.getDocument<Profile>(profilesCollection, id);

			if (!profile) {
				throw new Error('Profile not found.');
			}

			return profile;
		} catch (err) {
			throw err;
		}
	},

	getProfilesByIds: async (ids: string[]) => {
		try {
			const profiles = await database.listDocuments<Profile>(profilesCollection, [
				Query.equal('$id', ids)
			]);

			return profiles;
		} catch (err) {
			throw err;
		}
	},

	getPostById: async (documentId: string) => {
		return await database.getDocument<Post>(postsCollection, documentId);
	},

	getAccount: async () => {
		try {
			const response = await account.get();
			authStore.login(response);
			return response;
		} catch (err) {
			authStore.logout();
			throw err;
		}
	},

	loginWithGoogle: async () => {
		account.createOAuth2Session(
			'google',
			window.location.origin + '/writer/profile',
			window.location.origin + '/auth/login'
		);
	},

	login: async (mail: string, pass: string) => {
		const session = await account.createEmailSession(mail, pass);
		await AppwriteService.getAccount(); // Forcefully update store
		return session;
	},

	register: async (mail: string, pass: string, name: string) => {
		const response = await account.create('unique()', mail, pass, name);
		await AppwriteService.login(mail, pass);
		await AppwriteService.getAccount(); // Forcefully update store
		await AppwriteService.getSelfProfile(); // Forcefully update store
		return response;
	},

	listTeamMembers: async (teamId: string, page: number) => {
		return await teams.getMemberships(teamId, undefined, 25, (page - 1) * 25);
	},

	deleteTeamMembership: async (teamId: string, membershipId: string) => {
		return await teams.deleteMembership(teamId, membershipId);
	},

	logout: async () => {
		await account.deleteSession('current');

		try {
			await AppwriteService.getAccount(); // Forcefully update store
		} catch (err) {
			// Ignore
		}
	},

	getThumbnail: (id: string, width: number, height: number) => {
		return storage.getFilePreview(bucketId, id, width, height);
	},

	getAvatar: (name: string = 'Unnamed') => {
		return avatars.getInitials(name);
	},

	fetchUserPosts: (page: number, published: boolean) => {
		const profileId = get(profileStore)?.$id;

		if (!profileId) {
			throw new Error('Profile not found!');
		}

		return database.listDocuments<Post>(
			postsCollection,
			[Query.equal('profileId', profileId), Query.equal('published', published)],
			100,
			(page - 1) * 100,
			undefined,
			undefined,
			['createdAt'],
			['DESC']
		);
	},

	fetchPosts: (page: number, published: boolean) => {
		return database.listDocuments<Post>(
			postsCollection,
			[Query.equal('published', published)],
			25,
			(page - 1) * 25,
			undefined,
			undefined,
			['createdAt'],
			['DESC']
		);
	},

	fetchTeams: async (page: number) => {
		return await teams.list(undefined, 25, (page - 1) * 25, undefined, undefined, 'DESC');
	},

	deletePost: async (document: Post) => {
		if (document.coverId) {
			await storage.deleteFile(bucketId, document.coverId);
		}

		await database.deleteDocument(postsCollection, document.$id);
	},

	uploadFile: async (file: File) => {
		return await storage.createFile(bucketId, 'unique()', file, ['role:all']); // Write permissions to user given automatically
	},

	deleteFile: async (fileId: string) => {
		await storage.deleteFile(bucketId, fileId);
	},

	createTeam: async (name: string) => {
		return await teams.create('unique()', name);
	},

	inviteTeamMember: async (teamId: string, email: string, roles: string[], name: string) => {
		return await teams.createMembership(teamId, email, roles, window.location.origin, name);
	},

	acceptTeamInvitation: async (
		teamId: string,
		membershipId: string,
		userId: string,
		secret: string
	) => {
		return await teams.updateMembershipStatus(teamId, membershipId, userId, secret);
	},

	deleteTeam: async (teamId: string) => {
		return await teams.delete(teamId);
	},

	updateTeam: async (teamId: string, name: string) => {
		return await teams.update(teamId, name);
	},

	getTeamById: async (teamId: string) => {
		return await teams.get(teamId);
	},

	resetPassword: async (email: string) => {
		return await account.createRecovery(email, window.location.origin);
	},

	resetPasswordFinish: async (
		userId: string,
		secret: string,
		password: string,
		passwordAgain: string
	) => {
		return await account.updateRecovery(userId, secret, password, passwordAgain);
	},

	addComment: async (postId: string, profileId: string, text: string) => {
		// TODO: Security issue possible
		return await database.createDocument<Comment>(commentsCollection, 'unique()', {
			postId,
			profileId,
			text,
			createdAt: Math.round(Date.now() / 1000)
		});
	},

	getComments: async (postId: string, page: number) => {
		return await database.listDocuments<Comment>(
			commentsCollection,
			[Query.equal('postId', postId)],
			25,
			(page - 1) * 25,
			undefined,
			undefined,
			['createdAt'],
			['DESC']
		);
	}
};
