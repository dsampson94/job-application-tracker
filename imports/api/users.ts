import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

interface CV {
    name: string;
    url: string;
}

Meteor.methods({
    'users.updateProfile'(profile: { name: string; email: string; cvs: CV[] }) {
        check(profile, {
            name: String,
            email: String,
            cvs: Array,
        });

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Meteor.users.update(this.userId, {
            $set: {
                'profile.name': profile.name,
                'emails.0.address': profile.email,
                'profile.cvs': profile.cvs,
            },
        });
    },
});
