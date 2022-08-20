import { Button, IComponent, TextInput } from 'amq-toolbox';
import {
    AniListFactory,
    AnimeList,
    AnimeListSite,
    AuthOptions,
    KitsuFactory,
    MyAnimeListFactory
} from 'anime-list';

declare var displayMessage: (title: string, msg: string, callback?: Function) => void;

export class AnimeListAccount implements IComponent {
    public self: JQuery<HTMLElement>;
    private kitsu;
    private mal;
    private aniList;
    constructor () {
        this.self = $(`<div class="col-xs-6"></div>`)
            .css('text-align', 'center');
        this.kitsu = (new KitsuFactory()).getInstance();
        this.mal = (new MyAnimeListFactory()).getInstance();
        this.aniList = (new AniListFactory()).getInstance();
    }
    show (site: AnimeListSite) {
        this.self.empty();
        let animeList: AnimeList;
        switch (site) {
            case 'Kitsu':
                animeList = this.kitsu;
                break;
            case 'MyAnimeList':
                animeList = this.mal;
                break;
            case 'AniList':
                animeList = this.aniList;
                break;
        }
        if (animeList.logined()) {
            (async () => {
                const userInfo = await animeList.getMyInfo();
                const user = $(`<span>User : <b>${userInfo.name}</b></span>`)
                    .css('margin', '0 15px');
                const logoutBtn = new Button({
                    label: 'Logout',
                    size: 'normal',
                    style: 'danger',
                });
                logoutBtn.self.on('click', async () => {
                    await animeList.logout();
                    this.show(site);
                });
                this.self.append(user, logoutBtn.self);
            })();
        } else {
            const loginBtn = new Button({
                label: 'Login',
                size: 'normal',
                style: 'primary',
            });
            const spinner = $(`<i class="fa fa-spinner fa-spin hide"></i>`);
            const emailInput = new TextInput({placeholder: 'E-mail'});
            emailInput.self.css('padding', '5px 30px');
            const passwordInput = new TextInput({placeholder: 'Password', type: 'password'});
            passwordInput.self.css('padding', '5px 30px');
            if (site === 'Kitsu') {
                this.self.append(emailInput.self, passwordInput.self);
            }
            loginBtn.self.on('click', async () => {
                let loginInfo: AuthOptions;
                if (site === 'Kitsu') {
                    loginInfo = {
                        grantTypes: 'Password',
                        username: emailInput.getValue(),
                        password: passwordInput.getValue(),
                    };
                } else {
                    loginInfo = {grantTypes: 'Authorization Code'};
                }
                spinner.removeClass('hide');
                const err = await animeList.login(loginInfo);
                spinner.addClass('hide');
                if (err) {
                    displayMessage('Login Error', err.message);
                } else {
                    displayMessage('Login Successful', 'Login Successful', () => {this.show(site)});
                }
            });
            this.self.append(loginBtn.self, spinner);
        }
    }
    getAccount (site: AnimeListSite) {
        switch (site) {
            case 'Kitsu':
                return this.kitsu
            case 'MyAnimeList':
                return this.mal;
            case 'AniList':
                return this.aniList;
        }
    }
}