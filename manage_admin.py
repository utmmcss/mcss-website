import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

cred = credentials.Certificate('firebase_key.json')
firebase_admin.initialize_app(cred)

print('Fetching current users...')
page = auth.list_users()
while page:
    for user in page.users:

        print('UID: %s, ADMIN: %s, EMAIL: %s' % (user.uid, 'True' if user.custom_claims.get('admin') else 'False', user.email))

    page = page.get_next_page()

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