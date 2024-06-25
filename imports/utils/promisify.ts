export const callWithPromise = <T = any>(method: string, ...params: any[]): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        Meteor.call(method, ...params, (error: Meteor.Error, result: T) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};
