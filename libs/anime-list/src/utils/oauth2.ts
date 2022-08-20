export type GrantType = 'Authorization Code'
    | 'Implicit Flow'
    | 'Client Credentials' 
    | 'Password';

export interface AuthOptions {
    grantTypes: GrantType;
    username?: string;
    password?: string;
}

const authCodeKeyName = 'authorizationCode';

export function authoriationRequest(authURL: string): Promise<string | Error> {
    return new Promise((resolve, reject) => {
        GM_setValue(authCodeKeyName, '');
        const tab = GM_openInTab(authURL, {active: true, setParent: true});
        const listenerID = GM_addValueChangeListener(authCodeKeyName, (_, __, newValue) => {
            tab.close();
            resolve(newValue as string);
        });
        tab.onclose = () => {
            if (GM_getValue(authCodeKeyName) === '') {
                resolve(new Error('Authoriation Request failed'));
            }
            GM_removeValueChangeListener(listenerID);
            GM_deleteValue(authCodeKeyName);
        }
    });
}

export function redirectURLHandler(): void {
    const path = new URL(document.URL);
    const authCode = path.searchParams.get('code');
    if (GM_getValue(authCodeKeyName, undefined) !== undefined) {
        if (authCode) {
            GM_setValue(authCodeKeyName, authCode);
        } else {
            window.close();
        }
    }
}