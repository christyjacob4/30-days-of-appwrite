export const InputValidators = {
    name: (value: string) => {
        if (value.length > 128) {
            return { type: 'warning', msg: 'Name must be shorter 128 characters long at most.' };
        }

        return { type: 'success', msg: 'This is a good name!' };
    },
    title: (value: string) => {
        if (value.length > 128) {
            return { type: 'warning', msg: 'Title must be shorter 128 characters long at most.' };
        }

        return { type: 'success', msg: 'This is a good title!' };
    },
    none: (value: string) => {
        return;
    },
    nickname: (value: string) => {
        if (value.length > 128) {
            return { type: 'warning', msg: 'Nickname must be shorter 128 characters long at most.' };
        }

        return { type: 'success', msg: 'This is a good nickname!' };
    },
    password: (value: string) => {
        if (value.length < 8) {
            return { type: 'warning', msg: 'Password must be at least 8 characters long.' };
        }

        return { type: 'success', msg: 'This is a good password!' };
    },
    email: (value: string) => {
        if (
            !(value
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ))
        ) {
            return { type: 'warning', msg: 'Please provide a valid email address.' };
        }

        return { type: 'success', msg: 'This is a good email!' };
    }
};
