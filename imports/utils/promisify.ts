export const callWithPromise = <T>(method: string, ...args: any[]): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        Meteor.call(method, ...args, (error: Meteor.Error, result: T) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};
