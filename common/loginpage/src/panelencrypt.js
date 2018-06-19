/*
 * (c) Copyright Ascensio System SIA 2010-2018
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/

/*
    'encrypt' panel
    controller + view
*/

+function(){ 'use strict'
    var ControllerEncrypt = function(args={}) {
        args.caption = 'Encrypt panel';
        this.action = "encrypt";
    };

    ControllerEncrypt.prototype = Object.create(baseController.prototype);
    ControllerEncrypt.prototype.constructor = ControllerEncrypt;

    var ViewEncrypt = function(args) {
        args.tplPage = `<div class="action-panel ${args.action}"></div>`;
        args.menu = '.main-column.tool-menu';
        args.field = '.main-column.col-center';
        args.itemtext = utils.Lang.actEncrypt;

        baseView.prototype.constructor.call(this, args);
    };

    ViewEncrypt.prototype = Object.create(baseView.prototype);
    ViewEncrypt.prototype.constructor = ViewEncrypt;
    ViewEncrypt.prototype.paneltemplate = function(args) {
        var _opts = args.opts;

        var _lang = utils.Lang;
        let _html = `<div class="flexbox">
                        <div class='left-align'>
                            <h3 class='table-caption'>${_lang.actEncrypt}</h3>
                            <h4 class=''>${_lang.encDescr}</h4>
                            <section><div class="onoffswitch">
                                <input type="checkbox" name="onoffswitch" class="onoffswitch__checkbox" id="myonoffswitch">
                                <label class="onoffswitch__label" for="myonoffswitch"></label>                                
                            </div></section>
                            <div class='box-radio-btn'>
                                <input type='radio' name='encryptmode' value='off' id='enc-mode-none'>
                                <label for='enc-mode-none'>None</label>
                            </div>
                            <div class='box-radio-btn'>
                                <input type='radio' name='encryptmode' value='simple' id='enc-mode-simple'>
                                <label for='enc-mode-simple'>${_lang.encModeSimple}</label>
                                <section id='enc-mode-simple-box-pass' class='box-radio-btn__content'>
                                    <p>${_lang.encModeSimpleDescr}</p>
                                    <div class='box-radio-btn__content__elems'>
                                        <input class='tbox' type="password" placeholder='password'>
                                        <input class='tbox' type="password" placeholder='repeat password'>
                                        <button id='enc-apply-simple-pass' class="btn">Save</button>
                                    </div>
                                </section>
                            </div>
                            <div class='box-radio-btn'>
                                <input type='radio' name='encryptmode' value='adv' id='enc-mode-adv'>
                                <label for='enc-mode-adv'>${_lang.encModeAdvanced}</label>
                                <section id='enc-mode-adv-box-pass' class='box-radio-btn__content'>
                                    <p>Some options for advanced mode</p>
                                    <div class='box-radio-btn__content__elems'>
                                        <textarea rows='4' cols='50' spellcheck="false"></textarea>
                                        <button id='enc-apply-adv-pass' class="btn">Save</button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>`;

        return _html;
    };
    ViewEncrypt.prototype.renderpanel = function(template) {
        this.$panel && this.$panel.empty();
        this.$panel.append(template);
    };

    window.ControllerEncrypt = ControllerEncrypt;

    utils.fn.extend(ControllerEncrypt.prototype, (function(){
        function onClickEncryptMode(event) {
            let _mode = event.target.value;
            switch ( _mode ) {
            case 'adv': sdk.setEncryptMode(sdk.ENCRYPT_MODE_ADVANCED); 
                break;
            case 'simple':
                let _el_pass = this.view.$panel.find('#enc-mode-simple-box-pass input[type=password]');
                if ( _el_pass.get(0).value.length && _el_pass.get(0).value == _el_pass.get(1).value ) {
                    sdk.setEncryptMode(sdk.ENCRYPT_MODE_SIMPLE, _el_pass.get(0).value);
                    break;
                } 
            case 'off': sdk.setEncryptMode(sdk.ENCRYPT_MODE_NONE); break;
            }

            if ( _mode == 'simple' ) {
                this.view.$panel.find('#enc-mode-adv-box-pass > div')['removeClass']('expanded');
                setTimeout(e => {
                    this.view.$panel.find('#enc-mode-simple-box-pass > div')['addClass']('expanded');
                }, 150);
            } else
            // if ( _mode == 'adv' ) 
            {
                this.view.$panel.find('#enc-mode-simple-box-pass > div')[_mode == 'simple'? 'addClass' : 'removeClass']('expanded');
                this.view.$panel.find('#enc-mode-adv-box-pass > div')[_mode == 'adv'? 'addClass' : 'removeClass']('expanded');
            } 
        };

        function onClickApplySimplePass() {
            let _el_pass = this.view.$panel.find('#enc-mode-simple-box-pass input[type=password]');

            if ( _el_pass.length ) {
                _el_pass.removeClass('tbox--error');

                if ( _el_pass.get(0).value.length ) {
                    if ( _el_pass.get(0).value == _el_pass.get(1).value ) {
                        sdk.setEncryptMode(sdk.ENCRYPT_MODE_SIMPLE, _el_pass.get(0).value);
                    } else _el_pass.eq(1).addClass('tbox--error');
                } else {
                    _el_pass.addClass('tbox--error');
                }
            }
        };

        function onClickApplyAdvPass() {
            let _el_pass = this.view.$panel.find('#enc-mode-adv-box-pass textarea');

            if ( _el_pass.length ) {
                _el_pass.removeClass('tbox--error');

                if ( _el_pass.get(0).value.length ) {
                    sdk.setEncryptMode(sdk.ENCRYPT_MODE_ADVANCED, _el_pass.get(0).value);
                } else {
                    _el_pass.addClass('tbox--error');
                }
            }
        };

        return {
            init: function() {
                baseController.prototype.init.apply(this, arguments);

                let args = {action: this.action};

                window.sdk.on('on_native_message', (cmd, param) => {
                    if (/app\:ready/.test(cmd)) {
                        if ( !this.view ) {
                            this.view = new ViewEncrypt(args);
                            this.view.render();
                        } 

                        this.view.$panel.find('.box-radio-btn > input[type=simple]').parent().hide();
                        this.view.$panel.find('.box-radio-btn > input[type=adv]').parent().hide();

                        for ( let m of sdk.allowedEncryptModes() ) {
                            if ( m.type == sdk.ENCRYPT_MODE_SIMPLE ) {
                                this.view.$panel.find('.box-radio-btn > input[type=simple]').parent().show();

                                if ( m.info_presented ) {
                                    this.view.$panel.find('#enc-mode-simple-box-pass input[type=password]').val('_@#$$#@!$##$%&');
                                }
                            } else
                            if ( m.type == sdk.ENCRYPT_MODE_ADVANCED ) {
                                this.view.$panel.find('.box-radio-btn > input[type=adv]').parent().show();
                            }
                        }

                        this.view.renderpanel(this.view.paneltemplate(args));
                        let _$btns = this.view.$panel.find('input[type=radio]');
                        _$btns.on('click change', onClickEncryptMode.bind(this));

                        this.view.$panel.find('#enc-apply-simple-pass').on('click', onClickApplySimplePass.bind(this));
                        this.view.$panel.find('#enc-apply-adv-pass').on('click', onClickApplyAdvPass.bind(this));

                        switch ( sdk.encryptMode() ) {
                        case sdk.ENCRYPT_MODE_NONE: _$btns.eq(0).prop('checked', true); break;
                        case sdk.ENCRYPT_MODE_SIMPLE: _$btns.eq(1).prop('checked', true); break;
                        case sdk.ENCRYPT_MODE_ADVANCED: _$btns.eq(2).prop('checked', true); break;
                        }

                        this.view.$panel.find('#enc-mode-simple-box-pass > div')[
                            sdk.encryptMode() == sdk.ENCRYPT_MODE_SIMPLE ? 'addClass' : 'removeClass']('expanded');

                        this.view.$panel.find('#enc-mode-adv-box-pass > div')[
                            sdk.encryptMode() == sdk.ENCRYPT_MODE_ADVANCED ? 'addClass' : 'removeClass']('expanded');
                    }
                });

                return this;
            }
        }
    })());
}();

/*
*   controller definition
*/

// window.CommonEvents.on('main:ready', function(){
//     var p = new ControllerEncrypt({});
//     p.init();
// });
