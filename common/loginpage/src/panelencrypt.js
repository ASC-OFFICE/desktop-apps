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
        let _html = `<div class='box-warn left-align'><p class='box-warn__label'>You must set a password</p></div>
                    <div class="flexbox">
                        <div class='left-align'>
                            <div id='enc-box-caption'>
                                <h3 class='table-caption'>${_lang.actEncrypt}</h3>
                                <div class="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" class="onoffswitch__checkbox" id="enc-mode-switch">
                                    <label class="onoffswitch__label" for="enc-mode-switch"></label>
                                </div>
                            </div>
                            <h4 class='caption-description'>${_lang.encDescr}</h4>
                            <div class='box-radio-btn'>
                                <input type='radio' name='encryptmode' value='simple' id='enc-mode-simple'>
                                <label for='enc-mode-simple'>${_lang.encModeSimple}</label>
                                <section id='enc-mode-simple-box-pass' class='box-radio-btn__content'>
                                    <p>${_lang.encModeSimpleDescr}</p>
                                    <nav class='box-radio-btn__content__elems' style='display:none;'>
                                        <button class="btn" value='import'>Import key</button>
                                        <button class="btn" value='export'>Export key</button>
                                    </nav>
                                </section>
                            </div>
                            <div class='box-radio-btn feature'>
                                <input type='radio' name='encryptmode' value='std' id='enc-mode-std'>
                                <label for='enc-mode-std'>${_lang.encModeStandard}</label>
                                <section id='enc-mode-std-box-pass' class='box-radio-btn__content'>
                                    <p>Some options for standard mode</p>
                                    <nav class='box-radio-btn__content__elems' style='display:none;'>
                                        <button class="btn" value='import'>Import key</button>
                                        <button class="btn" value='export'>Export key</button>
                                    </nav>
                                </section>
                            </div>
                            <div class='box-radio-btn feature'>
                                <input type='radio' name='encryptmode' value='adv' id='enc-mode-adv'>
                                <label for='enc-mode-adv'>${_lang.encModeAdvanced}</label>
                                <section id='enc-mode-adv-box-pass' class='box-radio-btn__content'>
                                    <p>Some options for advanced mode</p>
                                    <nav class='box-radio-btn__content__elems' style='display:none'>
                                        <textarea rows='4' cols='50' spellcheck="false"></textarea>
                                        <button id='enc-apply-adv-pass' class="btn">Save</button>
                                    </nav>
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
        var $view;

        function onSwitchEncryptMode(e) {
            let _active = $view.$rbmode.filter(':checked'),
                _mode = _active.val();

            if ( e.target.checked ) {
                _requestChangeMode(_mode + ':on');
            } else _requestChangeMode(_mode + ':off');

            e.target.checked = !e.target.checked;
        };

        function onClickBtnSimplePass(e) {
            if ( e.target.value == 'export' ) {
                sdk.execCommand("encrypt:change", "simple:key:export");
            } else {
                sdk.execCommand("encrypt:change", "simple:key:import");
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

        function _requestChangeMode(opts) {
            window.sdk.execCommand("encrypt:change", opts);
        };

        function _turnModeOn(mode) {
            let me = this;
            switch (mode) {
            case sdk.ENCRYPT_MODE_SIMPLE: {
                sdk.setEncryptMode(sdk.ENCRYPT_MODE_SIMPLE);
                break; }
            case sdk.ENCRYPT_MODE_STANDARD:
                sdk.setEncryptMode(sdk.ENCRYPT_MODE_STANDARD);
                break;
            case sdk.ENCRYPT_MODE_ADVANCED: {
                let _el_pass = me.view.$panel.find('#enc-mode-adv-box-pass textarea');
                sdk.setEncryptMode(sdk.ENCRYPT_MODE_ADVANCED, _el_pass.get(0).value);
                break; }
            }
        };

        function _processChangeMode(args) {
            let me = this;

            if ( /off/.test(args) ) {
                if ( /\:allowed/.test(args) ) {
                    sdk.setEncryptMode(sdk.ENCRYPT_MODE_NONE);
                    me.view.$switch.prop('checked', false);
                    _disableRadioButton(null, false);
                } else {
                    /* show error that action was refused */
                    // me.view.$switch.prop('checked', true);
                }
            } else
            if ( /on/.test(args) ) {
                if ( /\:allowed/.test(args) ) {
                    _turnModeOn.call( me, (/^simple\:/.test(args) ?
                                    sdk.ENCRYPT_MODE_SIMPLE : sdk.ENCRYPT_MODE_ADVANCED) );

                    me.view.$switch.prop('checked', true);
                    _disableRadioButton();
                } else {
                    /* show error that action was refused */
                    // me.view.$switch.prop('checked', false);
                }
            }
        };

        function _initPanel() {
            var me = this;

            me.view.$rbmode = me.view.$panel.find('input[type=radio]');

            _disableRadioButton.call(me);

            for ( let m of sdk.encryptModes() ) {
                if ( m.type == sdk.ENCRYPT_MODE_SIMPLE ) {
                    _disableRadioButton(me.view.$rbmode.filter('[value=simple]'), false);
                    me.view.$panel.find('#enc-mode-simple-box-pass .box-radio-btn__content__elems').show();
                } else
                if ( m.type == sdk.ENCRYPT_MODE_STANDARD ) {
                    _disableRadioButton(me.view.$rbmode.filter('[value=std]'), false);
                    me.view.$panel.find('#enc-mode-std-box-pass .box-radio-btn__content__elems').show();

                    me.view.$rbmode.filter('[value=std]').parent().removeClass('feature');
                } else
                if ( m.type == sdk.ENCRYPT_MODE_ADVANCED ) {
                    _disableRadioButton(me.view.$rbmode.filter('[value=adv]'), false);
                    me.view.$panel.find('#enc-mode-adv-box-pass .box-radio-btn__content__elems').show();
                }
            }

            me.view.$switch = me.view.$panel.find('input[type=checkbox]');
            me.view.$rbmode = me.view.$rbmode.filter(':not(:disabled)');
            if ( me.view.$rbmode.length ) {
                me.view.$switch.on('change', onSwitchEncryptMode.bind(me));

                me.view.$panel.find('#enc-mode-simple-box-pass .btn').on('click', onClickBtnSimplePass.bind(me));
                me.view.$panel.find('#enc-apply-adv-pass').on('click', onClickApplyAdvPass.bind(me));

                let _mode = 'none';
                switch ( sdk.encryptMode() ) {
                // case sdk.ENCRYPT_MODE_NONE:
                case sdk.ENCRYPT_MODE_SIMPLE:
                    _mode = 'simple';
                    me.view.$rbmode.eq(0).prop('checked', true);
                    break;
                case sdk.ENCRYPT_MODE_STANDARD:
                    _mode = 'standard';
                    me.view.$rbmode.eq(1).prop('checked', true);
                    break;
                case sdk.ENCRYPT_MODE_ADVANCED:
                    _mode = 'advanced';
                    me.view.$rbmode.eq(2).prop('checked', true);
                    break;
                }

                if ( _mode != 'none' ) {
                    _mode = $view.$rbmode.filter(':checked').val();
                    _requestChangeMode(_mode + ':on');
                }

                let _$checked = me.view.$rbmode.filter(':checked');
                if ( !_$checked.length ) {
                    let _$active = me.view.$rbmode.filter(':not(:disabled)');
                    if ( _$active.length ) {
                        (_$checked = _$active.eq(0)).prop('checked', true);
                    }
                }
            } else {
                me.view.$switch.attr('disabled', true);
            }

            if ( me.view.$switch.get(0).checked )
                _disableRadioButton.call(this);

            // if ( _$checked.length ) {
            //     if ( _$checked.val() == 'simple' ) {
            //     } else
            //     if ( _$checked.val() == 'adv' ) {
            //     }
            // }
        };

        function _showWarning(message) {
            $view.$panel.find('.box-warn__label').html(message);
            $view.$panel.find('.box-warn').show();
        };

        function _hideWarning() {
            $view.$panel.find('.box-warn').hide();
        };

        function _disableRadioButton(btn, state = true) {
            !btn && (btn = $view.$rbmode);
            btn.parent().attr('disabled', state)
                .find('input, button, textarea').attr('disabled', state);
        };

        function _disableModeSwitch(state=true) {
            $view.$switch.attr('disabled', state)
                    .parent().attr('disabled', state);
        };

        return {
            init: function() {
                baseController.prototype.init.apply(this, arguments);

                let args = {action: this.action};

                window.sdk.on('on_native_message', (cmd, param) => {
                    if (/app\:ready/.test(cmd)) {
                        if ( !this.view ) {
                            $view = this.view = new ViewEncrypt(args);
                            this.view.render();

                            this.view.renderpanel(this.view.paneltemplate(args));

                            let _ls_item_name = 'secure-mode-used';
                            if ( !localStorage[_ls_item_name] ) {
                                $view.$menuitem.addClass('new');
                                $view.$menuitem.one('click', e => {
                                    $view.$menuitem.removeClass('new');
                                    localStorage.setItem(_ls_item_name, 'got');
                                });
                            }
                        }

                        _initPanel.call(this);
                    } else
                    if (/encrypt\:change/.test(cmd)) {
                        _processChangeMode.call(this, param);
                    } else
                    if (/tabs:changed/.test(cmd)) {
                        let json = JSON.parse(param);
                        if ( !json.editors ) {
                            _hideWarning();
                            _disableRadioButton(null, false);
                            _disableModeSwitch(false);
                        } else {
                            _showWarning('All opened documents must be closed to change security mode');
                            _disableRadioButton();
                            _disableModeSwitch();
                        }
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
