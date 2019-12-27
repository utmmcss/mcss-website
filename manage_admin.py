import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

cred = credentials.Certificate('firebase_key.json')
firebase_admin.initialize_app(cred)

while True:
    uid = input('Enter UID of user to manage [0 to quit]: ')

    if uid == '0':
        break
    else:
        confirmation = input('Do you want this user to become an admin %s? [Y/N/Cancel]: ' % str(auth.get_user(uid)))

        if confirmation == 'Y':
            auth.set_custom_user_claims(uid, {'admin': True})
            print('Done - Promoted')
        elif confirmation == 'N':

            auth.set_custom_user_claims(uid, {'admin': False})
            print('Done - Demoted')
        else:
            print('Aborted.')