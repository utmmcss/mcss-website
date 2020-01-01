import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

cred = credentials.Certificate('firebase_key.json')
firebase_admin.initialize_app(cred)

print('Fetching current users...')
page = auth.list_users()
while page:
    for user in page.users:

        print('UID: %s, ADMIN: %s, EMAIL: %s' % (user.uid, 'True' if user and user.custom_claims and user.custom_claims.get('admin') else 'False', user.email))

    page = page.get_next_page()

while True:
    email = input('Enter email of user to manage [0 to quit]: ')


    if email == '0':
        break
    else:

        try:
            user = auth.get_user_by_email(email)

            if user.email_verified:

                confirmation = input('Do you want this user to bee an admin (%s)? [Y/N/Cancel]: ' % str(email))

                if confirmation == 'Y':
                    auth.set_custom_user_claims(user.uid, {'admin': True})
                    print('Done - Promoted')
                elif confirmation == 'N':

                    auth.set_custom_user_claims(user.uid, {'admin': False})
                    print('Done - Demoted')
                else:
                    print('Aborted.')


            else:
                print('%s is not associated with an account!' % email)

        except:
            print('Unable to operate on that user. Do they have a valid account?')