(() => {
  var e = {
      807: (e) => {
        var t = !(
          "undefined" == typeof window ||
          !window.document ||
          !window.document.createElement
        );
        e.exports = t;
      },
    },
    t = {};
  function s(i) {
    var n = t[i];
    if (void 0 !== n) return n.exports;
    var o = (t[i] = { exports: {} });
    return e[i](o, o.exports, s), o.exports;
  }
  (() => {
    "use strict";
    class e {
      constructor(e) {
        let t = {
          logging: !0,
          init: !0,
          attributeOpenButton: "data-popup",
          attributeCloseButton: "data-close",
          fixElementSelector: "[data-lp]",
          youtubeAttribute: "data-youtube",
          youtubePlaceAttribute: "data-youtube-place",
          setAutoplayYoutube: !0,
          classes: {
            popup: "popup",
            popupContent: "popup__content",
            popupActive: "popup_show",
            bodyActive: "popup-show",
          },
          focusCatch: !0,
          closeEsc: !0,
          bodyLock: !0,
          bodyLockDelay: 500,
          hashSettings: { location: !0, goHash: !0 },
          on: {
            beforeOpen: function () {},
            afterOpen: function () {},
            beforeClose: function () {},
            afterClose: function () {},
          },
        };
        (this.isOpen = !1),
          (this.targetOpen = { selector: !1, element: !1 }),
          (this.previousOpen = { selector: !1, element: !1 }),
          (this.lastClosed = { selector: !1, element: !1 }),
          (this._dataValue = !1),
          (this.hash = !1),
          (this._reopen = !1),
          (this._selectorOpen = !1),
          (this.lastFocusEl = !1),
          (this._focusEl = [
            "a[href]",
            'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            "button:not([disabled]):not([aria-hidden])",
            "select:not([disabled]):not([aria-hidden])",
            "textarea:not([disabled]):not([aria-hidden])",
            "area[href]",
            "iframe",
            "object",
            "embed",
            "[contenteditable]",
            '[tabindex]:not([tabindex^="-"])',
          ]),
          (this.options = {
            ...t,
            ...e,
            classes: { ...t.classes, ...e?.classes },
            hashSettings: { ...t.hashSettings, ...e?.hashSettings },
            on: { ...t.on, ...e?.on },
          }),
          this.options.init && this.initPopups();
      }
      initPopups() {
        this.popupLogging("Проснулся"), this.eventsPopup();
      }
      eventsPopup() {
        document.addEventListener(
          "click",
          function (e) {
            const t = e.target.closest(`[${this.options.attributeOpenButton}]`);
            if (t)
              return (
                e.preventDefault(),
                (this._dataValue = t.getAttribute(
                  this.options.attributeOpenButton,
                )
                  ? t.getAttribute(this.options.attributeOpenButton)
                  : "error"),
                "error" !== this._dataValue
                  ? (this.isOpen || (this.lastFocusEl = t),
                    (this.targetOpen.selector = `${this._dataValue}`),
                    (this._selectorOpen = !0),
                    void this.open())
                  : void this.popupLogging(
                      `Ой ой, не заполнен атрибут у ${t.classList}`,
                    )
              );
            return e.target.closest(`[${this.options.attributeCloseButton}]`) ||
              (!e.target.closest(`.${this.options.classes.popupContent}`) &&
                this.isOpen)
              ? (e.preventDefault(), void this.close())
              : void 0;
          }.bind(this),
        ),
          document.addEventListener(
            "keydown",
            function (e) {
              if (
                this.options.closeEsc &&
                27 == e.which &&
                "Escape" === e.code &&
                this.isOpen
              )
                return e.preventDefault(), void this.close();
              this.options.focusCatch &&
                9 == e.which &&
                this.isOpen &&
                this._focusCatch(e);
            }.bind(this),
          ),
          document.querySelector("form[data-ajax],form[data-dev]") &&
            document.addEventListener(
              "formSent",
              function (e) {
                const t = e.detail.form.dataset.popupMessage;
                t && this.open(t);
              }.bind(this),
            ),
          this.options.hashSettings.goHash &&
            (window.addEventListener(
              "hashchange",
              function () {
                window.location.hash
                  ? this._openToHash()
                  : this.close(this.targetOpen.selector);
              }.bind(this),
            ),
            window.addEventListener(
              "load",
              function () {
                window.location.hash && this._openToHash();
              }.bind(this),
            ));
      }
      open(e) {
        if (
          (e &&
            "string" == typeof e &&
            "" !== e.trim() &&
            ((this.targetOpen.selector = e), (this._selectorOpen = !0)),
          this.isOpen && ((this._reopen = !0), this.close()),
          this._selectorOpen ||
            (this.targetOpen.selector = this.lastClosed.selector),
          this._reopen || (this.previousActiveElement = document.activeElement),
          (this.targetOpen.element = document.querySelector(
            this.targetOpen.selector,
          )),
          this.targetOpen.element)
        ) {
          if (
            this.targetOpen.element.hasAttribute(this.options.youtubeAttribute)
          ) {
            const e = `https://www.youtube.com/embed/${this.targetOpen.element.getAttribute(
                this.options.youtubeAttribute,
              )}?rel=0&showinfo=0&autoplay=1`,
              t = document.createElement("iframe");
            t.setAttribute("allowfullscreen", "");
            const s = this.options.setAutoplayYoutube ? "autoplay;" : "";
            t.setAttribute("allow", `${s}; encrypted-media`),
              t.setAttribute("src", e),
              this.targetOpen.element.querySelector(
                `[${this.options.youtubePlaceAttribute}]`,
              ) &&
                this.targetOpen.element
                  .querySelector(`[${this.options.youtubePlaceAttribute}]`)
                  .appendChild(t);
          }
          this.options.hashSettings.location &&
            (this._getHash(), this._setHash()),
            this.options.on.beforeOpen(this),
            this.targetOpen.element.classList.add(
              this.options.classes.popupActive,
            ),
            document.body.classList.add(this.options.classes.bodyActive),
            this._reopen ? (this._reopen = !1) : r(),
            this.targetOpen.element.setAttribute("aria-hidden", "false"),
            (this.previousOpen.selector = this.targetOpen.selector),
            (this.previousOpen.element = this.targetOpen.element),
            (this._selectorOpen = !1),
            (this.isOpen = !0),
            setTimeout(() => {
              this._focusTrap();
            }, 50),
            document.dispatchEvent(
              new CustomEvent("afterPopupOpen", { detail: { popup: this } }),
            ),
            this.popupLogging("Открыл попап");
        } else
          this.popupLogging(
            "Ой ой, такого попапа нет. Проверьте корректность ввода. ",
          );
      }
      close(e) {
        e &&
          "string" == typeof e &&
          "" !== e.trim() &&
          (this.previousOpen.selector = e),
          this.isOpen &&
            o &&
            (this.options.on.beforeClose(this),
            this.targetOpen.element.hasAttribute(
              this.options.youtubeAttribute,
            ) &&
              this.targetOpen.element.querySelector(
                `[${this.options.youtubePlaceAttribute}]`,
              ) &&
              (this.targetOpen.element.querySelector(
                `[${this.options.youtubePlaceAttribute}]`,
              ).innerHTML = ""),
            this.previousOpen.element.classList.remove(
              this.options.classes.popupActive,
            ),
            this.previousOpen.element.setAttribute("aria-hidden", "true"),
            this._reopen ||
              (document.body.classList.remove(this.options.classes.bodyActive),
              r(),
              (this.isOpen = !1)),
            this._removeHash(),
            this._selectorOpen &&
              ((this.lastClosed.selector = this.previousOpen.selector),
              (this.lastClosed.element = this.previousOpen.element)),
            this.options.on.afterClose(this),
            setTimeout(() => {
              this._focusTrap();
            }, 50),
            this.popupLogging("Закрыл попап"));
      }
      _getHash() {
        this.options.hashSettings.location &&
          (this.hash = this.targetOpen.selector.includes("#")
            ? this.targetOpen.selector
            : this.targetOpen.selector.replace(".", "#"));
      }
      _openToHash() {
        let e = document.querySelector(
          `.${window.location.hash.replace("#", "")}`,
        )
          ? `.${window.location.hash.replace("#", "")}`
          : document.querySelector(`${window.location.hash}`)
          ? `${window.location.hash}`
          : null;
        document.querySelector(
          `[${this.options.attributeOpenButton}="${e}"]`,
        ) &&
          e &&
          this.open(e);
      }
      _setHash() {
        history.pushState("", "", this.hash);
      }
      _removeHash() {
        history.pushState("", "", window.location.href.split("#")[0]);
      }
      _focusCatch(e) {
        const t = this.targetOpen.element.querySelectorAll(this._focusEl),
          s = Array.prototype.slice.call(t),
          i = s.indexOf(document.activeElement);
        e.shiftKey && 0 === i && (s[s.length - 1].focus(), e.preventDefault()),
          e.shiftKey ||
            i !== s.length - 1 ||
            (s[0].focus(), e.preventDefault());
      }
      _focusTrap() {
        const e = this.previousOpen.element.querySelectorAll(this._focusEl);
        !this.isOpen && this.lastFocusEl
          ? this.lastFocusEl.focus()
          : e[0].focus();
      }
      popupLogging(e) {
        this.options.logging && c(`[Попапос]: ${e}`);
      }
    }
    let t = (e, t = 500, s = 0) => {
        e.classList.contains("_slide") ||
          (e.classList.add("_slide"),
          (e.style.transitionProperty = "height, margin, padding"),
          (e.style.transitionDuration = t + "ms"),
          (e.style.height = `${e.offsetHeight}px`),
          e.offsetHeight,
          (e.style.overflow = "hidden"),
          (e.style.height = s ? `${s}px` : "0px"),
          (e.style.paddingTop = 0),
          (e.style.paddingBottom = 0),
          (e.style.marginTop = 0),
          (e.style.marginBottom = 0),
          window.setTimeout(() => {
            (e.hidden = !s),
              !s && e.style.removeProperty("height"),
              e.style.removeProperty("padding-top"),
              e.style.removeProperty("padding-bottom"),
              e.style.removeProperty("margin-top"),
              e.style.removeProperty("margin-bottom"),
              !s && e.style.removeProperty("overflow"),
              e.style.removeProperty("transition-duration"),
              e.style.removeProperty("transition-property"),
              e.classList.remove("_slide");
          }, t));
      },
      i = (e, t = 500, s = 0) => {
        if (!e.classList.contains("_slide")) {
          e.classList.add("_slide"),
            (e.hidden = !e.hidden && null),
            s && e.style.removeProperty("height");
          let i = e.offsetHeight;
          (e.style.overflow = "hidden"),
            (e.style.height = s ? `${s}px` : "0px"),
            (e.style.paddingTop = 0),
            (e.style.paddingBottom = 0),
            (e.style.marginTop = 0),
            (e.style.marginBottom = 0),
            e.offsetHeight,
            (e.style.transitionProperty = "height, margin, padding"),
            (e.style.transitionDuration = t + "ms"),
            (e.style.height = i + "px"),
            e.style.removeProperty("padding-top"),
            e.style.removeProperty("padding-bottom"),
            e.style.removeProperty("margin-top"),
            e.style.removeProperty("margin-bottom"),
            window.setTimeout(() => {
              e.style.removeProperty("height"),
                e.style.removeProperty("overflow"),
                e.style.removeProperty("transition-duration"),
                e.style.removeProperty("transition-property"),
                e.classList.remove("_slide");
            }, t);
        }
      },
      n = (e, s = 500) => (e.hidden ? i(e, s) : t(e, s)),
      o = !0,
      r = (e = 500) => {
        document.documentElement.classList.contains("lock") ? a(e) : l(e);
      },
      a = (e = 500) => {
        let t = document.querySelector("body");
        if (o) {
          let s = document.querySelectorAll("[data-lp]");
          setTimeout(() => {
            for (let e = 0; e < s.length; e++) {
              s[e].style.paddingRight = "0px";
            }
            (t.style.paddingRight = "0px"),
              document.documentElement.classList.remove("lock");
          }, e),
            (o = !1),
            setTimeout(function () {
              o = !0;
            }, e);
        }
      },
      l = (e = 500) => {
        let t = document.querySelector("body");
        if (o) {
          let s = document.querySelectorAll("[data-lp]");
          for (let e = 0; e < s.length; e++) {
            s[e].style.paddingRight =
              window.innerWidth -
              document.querySelector(".wrapper").offsetWidth +
              "px";
          }
          (t.style.paddingRight =
            window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px"),
            document.documentElement.classList.add("lock"),
            (o = !1),
            setTimeout(function () {
              o = !0;
            }, e);
        }
      };
    function c(e) {
      setTimeout(() => {
        window.FLS && console.log(e);
      }, 0);
    }
    let u = (e, t = !1, s = 500, i = 0) => {
      const n = document.querySelector(e);
      if (n) {
        let o = "",
          r = 0;
        t &&
          ((o = "header.header"), (r = document.querySelector(o).offsetHeight));
        let l = {
          speedAsDuration: !0,
          speed: s,
          header: o,
          offset: i,
          easing: "easeOutQuad",
        };
        if (
          (document.documentElement.classList.contains("menu-open") &&
            (a(), document.documentElement.classList.remove("menu-open")),
          "undefined" != typeof SmoothScroll)
        )
          new SmoothScroll().animateScroll(n, "", l);
        else {
          let e = n.getBoundingClientRect().top + scrollY;
          window.scrollTo({ top: r ? e - r : e, behavior: "smooth" });
        }
        c(`[gotoBlock]: Юхуу...едем к ${e}`);
      } else c(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${e}`);
    };
    class d {
      constructor(e, t = null) {
        if (
          ((this.config = Object.assign({ init: !0, logging: !0 }, e)),
          (this.selectClasses = {
            classSelect: "select",
            classSelectBody: "select__body",
            classSelectTitle: "select__title",
            classSelectValue: "select__value",
            classSelectLabel: "select__label",
            classSelectInput: "select__input",
            classSelectText: "select__text",
            classSelectLink: "select__link",
            classSelectOptions: "select__options",
            classSelectOptionsScroll: "select__scroll",
            classSelectOption: "select__option",
            classSelectContent: "select__content",
            classSelectRow: "select__row",
            classSelectData: "select__asset",
            classSelectDisabled: "_select-disabled",
            classSelectTag: "_select-tag",
            classSelectOpen: "_select-open",
            classSelectActive: "_select-active",
            classSelectFocus: "_select-focus",
            classSelectMultiple: "_select-multiple",
            classSelectCheckBox: "_select-checkbox",
            classSelectOptionSelected: "_select-selected",
          }),
          (this._this = this),
          this.config.init)
        ) {
          const e = t
            ? document.querySelectorAll(t)
            : document.querySelectorAll("select");
          e.length
            ? (this.selectsInit(e),
              this.setLogging(`Проснулся, построил селектов: (${e.length})`))
            : this.setLogging("Сплю, нет ни одного select zzZZZzZZz");
        }
      }
      getSelectClass(e) {
        return `.${e}`;
      }
      getSelectElement(e, t) {
        return {
          originalSelect: e.querySelector("select"),
          selectElement: e.querySelector(this.getSelectClass(t)),
        };
      }
      selectsInit(e) {
        e.forEach((e, t) => {
          this.selectInit(e, t + 1);
        }),
          document.addEventListener(
            "click",
            function (e) {
              this.selectsActions(e);
            }.bind(this),
          ),
          document.addEventListener(
            "keydown",
            function (e) {
              this.selectsActions(e);
            }.bind(this),
          ),
          document.addEventListener(
            "focusin",
            function (e) {
              this.selectsActions(e);
            }.bind(this),
          ),
          document.addEventListener(
            "focusout",
            function (e) {
              this.selectsActions(e);
            }.bind(this),
          );
      }
      selectInit(e, t) {
        const s = this;
        let i = document.createElement("div");
        if (
          (i.classList.add(this.selectClasses.classSelect),
          e.parentNode.insertBefore(i, e),
          i.appendChild(e),
          (e.hidden = !0),
          t && (e.dataset.id = t),
          i.insertAdjacentHTML(
            "beforeend",
            `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`,
          ),
          this.selectBuild(e),
          this.getSelectPlaceholder(e) &&
            ((e.dataset.placeholder = this.getSelectPlaceholder(e).value),
            this.getSelectPlaceholder(e).label.show))
        ) {
          this.getSelectElement(
            i,
            this.selectClasses.classSelectTitle,
          ).selectElement.insertAdjacentHTML(
            "afterbegin",
            `<span class="${this.selectClasses.classSelectLabel}">${
              this.getSelectPlaceholder(e).label.text
                ? this.getSelectPlaceholder(e).label.text
                : this.getSelectPlaceholder(e).value
            }</span>`,
          );
        }
        (e.dataset.speed = e.dataset.speed ? e.dataset.speed : "150"),
          e.addEventListener("change", function (e) {
            s.selectChange(e);
          });
      }
      selectBuild(e) {
        const t = e.parentElement;
        (t.dataset.id = e.dataset.id),
          t.classList.add(
            e.getAttribute("class") ? `select_${e.getAttribute("class")}` : "",
          ),
          e.multiple
            ? t.classList.add(this.selectClasses.classSelectMultiple)
            : t.classList.remove(this.selectClasses.classSelectMultiple),
          e.hasAttribute("data-checkbox") && e.multiple
            ? t.classList.add(this.selectClasses.classSelectCheckBox)
            : t.classList.remove(this.selectClasses.classSelectCheckBox),
          this.setSelectTitleValue(t, e),
          this.setOptions(t, e),
          e.hasAttribute("data-search") && this.searchActions(t),
          e.hasAttribute("data-open") && this.selectAction(t),
          this.selectDisabled(t, e);
      }
      selectsActions(e) {
        const t = e.target,
          s = e.type;
        if (
          t.closest(this.getSelectClass(this.selectClasses.classSelect)) ||
          t.closest(this.getSelectClass(this.selectClasses.classSelectTag))
        ) {
          const i = t.closest(".select")
              ? t.closest(".select")
              : document.querySelector(
                  `.${this.selectClasses.classSelect}[data-id="${
                    t.closest(
                      this.getSelectClass(this.selectClasses.classSelectTag),
                    ).dataset.selectId
                  }"]`,
                ),
            n = this.getSelectElement(i).originalSelect;
          if ("click" === s) {
            if (!n.disabled)
              if (
                t.closest(
                  this.getSelectClass(this.selectClasses.classSelectTag),
                )
              ) {
                const e = t.closest(
                    this.getSelectClass(this.selectClasses.classSelectTag),
                  ),
                  s = document.querySelector(
                    `.${this.selectClasses.classSelect}[data-id="${e.dataset.selectId}"] .select__option[data-value="${e.dataset.value}"]`,
                  );
                this.optionAction(i, n, s);
              } else if (
                t.closest(
                  this.getSelectClass(this.selectClasses.classSelectTitle),
                )
              )
                this.selectAction(i);
              else if (
                t.closest(
                  this.getSelectClass(this.selectClasses.classSelectOption),
                )
              ) {
                const e = t.closest(
                  this.getSelectClass(this.selectClasses.classSelectOption),
                );
                this.optionAction(i, n, e);
              }
          } else
            "focusin" === s || "focusout" === s
              ? t.closest(
                  this.getSelectClass(this.selectClasses.classSelect),
                ) &&
                ("focusin" === s
                  ? i.classList.add(this.selectClasses.classSelectFocus)
                  : i.classList.remove(this.selectClasses.classSelectFocus))
              : "keydown" === s && "Escape" === e.code && this.selectsСlose();
        } else this.selectsСlose();
      }
      selectsСlose() {
        const e = document.querySelectorAll(
          `${this.getSelectClass(
            this.selectClasses.classSelect,
          )}${this.getSelectClass(this.selectClasses.classSelectOpen)}`,
        );
        e.length &&
          e.forEach((e) => {
            this.selectAction(e);
          });
      }
      selectAction(e) {
        const t = this.getSelectElement(e).originalSelect,
          s = this.getSelectElement(
            e,
            this.selectClasses.classSelectOptions,
          ).selectElement;
        s.classList.contains("_slide") ||
          (e.classList.toggle(this.selectClasses.classSelectOpen),
          n(s, t.dataset.speed));
      }
      setSelectTitleValue(e, t) {
        const s = this.getSelectElement(
            e,
            this.selectClasses.classSelectBody,
          ).selectElement,
          i = this.getSelectElement(
            e,
            this.selectClasses.classSelectTitle,
          ).selectElement;
        i && i.remove(),
          s.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(e, t));
      }
      getSelectTitleValue(e, t) {
        let s = this.getSelectedOptionsData(t, 2).html;
        if (
          (t.multiple &&
            t.hasAttribute("data-tags") &&
            ((s = this.getSelectedOptionsData(t)
              .elements.map(
                (t) =>
                  `<span role="button" data-select-id="${
                    e.dataset.id
                  }" data-value="${
                    t.value
                  }" class="_select-tag">${this.getSelectElementContent(
                    t,
                  )}</span>`,
              )
              .join("")),
            t.dataset.tags &&
              document.querySelector(t.dataset.tags) &&
              ((document.querySelector(t.dataset.tags).innerHTML = s),
              t.hasAttribute("data-search") && (s = !1))),
          (s = s.length ? s : t.dataset.placeholder),
          this.getSelectedOptionsData(t).values.length
            ? e.classList.add(this.selectClasses.classSelectActive)
            : e.classList.remove(this.selectClasses.classSelectActive),
          t.hasAttribute("data-search"))
        )
          return `<div class="${this.selectClasses.classSelectTitle}"><span class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${s}" data-placeholder="${s}" class="${this.selectClasses.classSelectInput}"></span></div>`;
        {
          const e =
            this.getSelectedOptionsData(t).elements.length &&
            this.getSelectedOptionsData(t).elements[0].dataset.class
              ? ` ${this.getSelectedOptionsData(t).elements[0].dataset.class}`
              : "";
          return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span class="${this.selectClasses.classSelectValue}"><span class="${this.selectClasses.classSelectContent}${e}">${s}</span></span></button>`;
        }
      }
      getSelectElementContent(e) {
        const t = e.dataset.asset ? `${e.dataset.asset}` : "",
          s = t.indexOf("img") >= 0 ? `<img src="${t}" alt="">` : t;
        let i = "";
        return (
          (i += t ? `<span class="${this.selectClasses.classSelectRow}">` : ""),
          (i += t
            ? `<span class="${this.selectClasses.classSelectData}">`
            : ""),
          (i += t ? s : ""),
          (i += t ? "</span>" : ""),
          (i += t
            ? `<span class="${this.selectClasses.classSelectText}">`
            : ""),
          (i += e.textContent),
          (i += t ? "</span>" : ""),
          (i += t ? "</span>" : ""),
          i
        );
      }
      getSelectPlaceholder(e) {
        const t = Array.from(e.options).find((e) => !e.value);
        if (t)
          return {
            value: t.textContent,
            show: t.hasAttribute("data-show"),
            label: {
              show: t.hasAttribute("data-label"),
              text: t.dataset.label,
            },
          };
      }
      getSelectedOptionsData(e, t) {
        let s = [];
        return (
          e.multiple
            ? (s = Array.from(e.options)
                .filter((e) => e.value)
                .filter((e) => e.selected))
            : s.push(e.options[e.selectedIndex]),
          {
            elements: s.map((e) => e),
            values: s.filter((e) => e.value).map((e) => e.value),
            html: s.map((e) => this.getSelectElementContent(e)),
          }
        );
      }
      getOptions(e) {
        let t = e.hasAttribute("data-scroll") ? "data-simplebar" : "",
          s = e.dataset.scroll
            ? `style="max-height:${e.dataset.scroll}px"`
            : "",
          i = Array.from(e.options);
        if (i.length > 0) {
          let n = "";
          return (
            ((this.getSelectPlaceholder(e) &&
              !this.getSelectPlaceholder(e).show) ||
              e.multiple) &&
              (i = i.filter((e) => e.value)),
            (n += t
              ? `<div ${t} ${s} class="${this.selectClasses.classSelectOptionsScroll}">`
              : ""),
            i.forEach((t) => {
              n += this.getOption(t, e);
            }),
            (n += t ? "</div>" : ""),
            n
          );
        }
      }
      getOption(e, t) {
        const s =
            e.selected && t.multiple
              ? ` ${this.selectClasses.classSelectOptionSelected}`
              : "",
          i =
            e.selected && !t.hasAttribute("data-show-selected") ? "hidden" : "",
          n = e.dataset.class ? ` ${e.dataset.class}` : "",
          o = !!e.dataset.href && e.dataset.href,
          r = e.hasAttribute("data-href-blank") ? 'target="_blank"' : "";
        let a = "";
        return (
          (a += o
            ? `<a ${r} ${i} href="${o}" data-value="${e.value}" class="${this.selectClasses.classSelectOption}${n}${s}">`
            : `<button ${i} class="${this.selectClasses.classSelectOption}${n}${s}" data-value="${e.value}" type="button">`),
          (a += this.getSelectElementContent(e)),
          (a += o ? "</a>" : "</button>"),
          a
        );
      }
      setOptions(e, t) {
        this.getSelectElement(
          e,
          this.selectClasses.classSelectOptions,
        ).selectElement.innerHTML = this.getOptions(t);
      }
      optionAction(e, t, s) {
        if (t.multiple) {
          s.classList.toggle(this.selectClasses.classSelectOptionSelected);
          this.getSelectedOptionsData(t).elements.forEach((e) => {
            e.removeAttribute("selected");
          });
          e.querySelectorAll(
            this.getSelectClass(this.selectClasses.classSelectOptionSelected),
          ).forEach((e) => {
            t.querySelector(`option[value="${e.dataset.value}"]`).setAttribute(
              "selected",
              "selected",
            );
          });
        } else
          t.hasAttribute("data-show-selected") ||
            (e.querySelector(
              `${this.getSelectClass(
                this.selectClasses.classSelectOption,
              )}[hidden]`,
            ) &&
              (e.querySelector(
                `${this.getSelectClass(
                  this.selectClasses.classSelectOption,
                )}[hidden]`,
              ).hidden = !1),
            (s.hidden = !0)),
            (t.value = s.hasAttribute("data-value")
              ? s.dataset.value
              : s.textContent),
            this.selectAction(e);
        this.setSelectTitleValue(e, t), this.setSelectChange(t);
      }
      selectChange(e) {
        const t = e.target;
        this.selectBuild(t), this.setSelectChange(t);
      }
      setSelectChange(e) {
        if (
          (e.hasAttribute("data-validate") && h.validateInput(e),
          e.hasAttribute("data-submit") && e.value)
        ) {
          let t = document.createElement("button");
          (t.type = "submit"),
            e.closest("form").append(t),
            t.click(),
            t.remove();
        }
        const t = e.parentElement;
        this.selectCallback(t, e);
      }
      selectDisabled(e, t) {
        t.disabled
          ? (e.classList.add(this.selectClasses.classSelectDisabled),
            (this.getSelectElement(
              e,
              this.selectClasses.classSelectTitle,
            ).selectElement.disabled = !0))
          : (e.classList.remove(this.selectClasses.classSelectDisabled),
            (this.getSelectElement(
              e,
              this.selectClasses.classSelectTitle,
            ).selectElement.disabled = !1));
      }
      searchActions(e) {
        this.getSelectElement(e).originalSelect;
        const t = this.getSelectElement(
            e,
            this.selectClasses.classSelectInput,
          ).selectElement,
          s = this.getSelectElement(
            e,
            this.selectClasses.classSelectOptions,
          ).selectElement,
          i = s.querySelectorAll(`.${this.selectClasses.classSelectOption}`),
          n = this;
        t.addEventListener("input", function () {
          i.forEach((e) => {
            e.textContent.toUpperCase().indexOf(t.value.toUpperCase()) >= 0
              ? (e.hidden = !1)
              : (e.hidden = !0);
          }),
            !0 === s.hidden && n.selectAction(e);
        });
      }
      selectCallback(e, t) {
        document.dispatchEvent(
          new CustomEvent("selectCallback", { detail: { select: t } }),
        );
      }
      setLogging(e) {
        this.config.logging && c(`[select]: ${e}`);
      }
    }
    const p = { inputMaskModule: null, selectModule: null };
    let h = {
      getErrors(e) {
        let t = 0,
          s = e.querySelectorAll("*[data-required]");
        return (
          s.length &&
            s.forEach((e) => {
              (null === e.offsetParent && "SELECT" !== e.tagName) ||
                e.disabled ||
                (t += this.validateInput(e));
            }),
          t
        );
      },
      validateInput(e) {
        let t = 0;
        return (
          "email" === e.dataset.required
            ? ((e.value = e.value.replace(" ", "")),
              this.emailTest(e) ? (this.addError(e), t++) : this.removeError(e))
            : ("checkbox" !== e.type || e.checked) && e.value
            ? this.removeError(e)
            : (this.addError(e), t++),
          t
        );
      },
      addError(e) {
        e.classList.add("_form-error"),
          e.parentElement.classList.add("_form-error");
        let t = e.parentElement.querySelector(".form__error");
        t && e.parentElement.removeChild(t),
          e.dataset.error &&
            e.parentElement.insertAdjacentHTML(
              "beforeend",
              `<div class="form__error">${e.dataset.error}</div>`,
            );
      },
      removeError(e) {
        e.classList.remove("_form-error"),
          e.parentElement.classList.remove("_form-error"),
          e.parentElement.querySelector(".form__error") &&
            e.parentElement.removeChild(
              e.parentElement.querySelector(".form__error"),
            );
      },
      formClean(e) {
        e.reset(),
          setTimeout(() => {
            let t = e.querySelectorAll("input,textarea");
            for (let e = 0; e < t.length; e++) {
              const s = t[e];
              s.parentElement.classList.remove("_form-focus"),
                s.classList.remove("_form-focus"),
                h.removeError(s);
            }
            let s = e.querySelectorAll(".checkbox__input");
            if (s.length > 0)
              for (let e = 0; e < s.length; e++) {
                s[e].checked = !1;
              }
            if (p.selectModule) {
              let t = e.querySelectorAll(".select");
              if (t.length)
                for (let e = 0; e < t.length; e++) {
                  const s = t[e].querySelector("select");
                  p.selectModule.selectBuild(s);
                }
            }
          }, 0);
      },
      emailTest: (e) =>
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(e.value),
    };
    function f(e) {
      if (null == e) return window;
      if ("[object Window]" !== e.toString()) {
        var t = e.ownerDocument;
        return (t && t.defaultView) || window;
      }
      return e;
    }
    function m(e) {
      return e instanceof f(e).Element || e instanceof Element;
    }
    function v(e) {
      return e instanceof f(e).HTMLElement || e instanceof HTMLElement;
    }
    function g(e) {
      return (
        "undefined" != typeof ShadowRoot &&
        (e instanceof f(e).ShadowRoot || e instanceof ShadowRoot)
      );
    }
    var b = Math.max,
      y = Math.min,
      x = Math.round;
    function E() {
      var e = navigator.userAgentData;
      return null != e && e.brands && Array.isArray(e.brands)
        ? e.brands
            .map(function (e) {
              return e.brand + "/" + e.version;
            })
            .join(" ")
        : navigator.userAgent;
    }
    function w() {
      return !/^((?!chrome|android).)*safari/i.test(E());
    }
    function S(e, t, s) {
      void 0 === t && (t = !1), void 0 === s && (s = !1);
      var i = e.getBoundingClientRect(),
        n = 1,
        o = 1;
      t &&
        v(e) &&
        ((n = (e.offsetWidth > 0 && x(i.width) / e.offsetWidth) || 1),
        (o = (e.offsetHeight > 0 && x(i.height) / e.offsetHeight) || 1));
      var r = (m(e) ? f(e) : window).visualViewport,
        a = !w() && s,
        l = (i.left + (a && r ? r.offsetLeft : 0)) / n,
        c = (i.top + (a && r ? r.offsetTop : 0)) / o,
        u = i.width / n,
        d = i.height / o;
      return {
        width: u,
        height: d,
        top: c,
        right: l + u,
        bottom: c + d,
        left: l,
        x: l,
        y: c,
      };
    }
    function O(e) {
      var t = f(e);
      return { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset };
    }
    function A(e) {
      return e ? (e.nodeName || "").toLowerCase() : null;
    }
    function C(e) {
      return ((m(e) ? e.ownerDocument : e.document) || window.document)
        .documentElement;
    }
    function L(e) {
      return S(C(e)).left + O(e).scrollLeft;
    }
    function k(e) {
      return f(e).getComputedStyle(e);
    }
    function T(e) {
      var t = k(e),
        s = t.overflow,
        i = t.overflowX,
        n = t.overflowY;
      return /auto|scroll|overlay|hidden/.test(s + n + i);
    }
    function _(e, t, s) {
      void 0 === s && (s = !1);
      var i,
        n,
        o = v(t),
        r =
          v(t) &&
          (function (e) {
            var t = e.getBoundingClientRect(),
              s = x(t.width) / e.offsetWidth || 1,
              i = x(t.height) / e.offsetHeight || 1;
            return 1 !== s || 1 !== i;
          })(t),
        a = C(t),
        l = S(e, r, s),
        c = { scrollLeft: 0, scrollTop: 0 },
        u = { x: 0, y: 0 };
      return (
        (o || (!o && !s)) &&
          (("body" !== A(t) || T(a)) &&
            (c =
              (i = t) !== f(i) && v(i)
                ? { scrollLeft: (n = i).scrollLeft, scrollTop: n.scrollTop }
                : O(i)),
          v(t)
            ? (((u = S(t, !0)).x += t.clientLeft), (u.y += t.clientTop))
            : a && (u.x = L(a))),
        {
          x: l.left + c.scrollLeft - u.x,
          y: l.top + c.scrollTop - u.y,
          width: l.width,
          height: l.height,
        }
      );
    }
    function M(e) {
      var t = S(e),
        s = e.offsetWidth,
        i = e.offsetHeight;
      return (
        Math.abs(t.width - s) <= 1 && (s = t.width),
        Math.abs(t.height - i) <= 1 && (i = t.height),
        { x: e.offsetLeft, y: e.offsetTop, width: s, height: i }
      );
    }
    function D(e) {
      return "html" === A(e)
        ? e
        : e.assignedSlot || e.parentNode || (g(e) ? e.host : null) || C(e);
    }
    function W(e) {
      return ["html", "body", "#document"].indexOf(A(e)) >= 0
        ? e.ownerDocument.body
        : v(e) && T(e)
        ? e
        : W(D(e));
    }
    function N(e, t) {
      var s;
      void 0 === t && (t = []);
      var i = W(e),
        n = i === (null == (s = e.ownerDocument) ? void 0 : s.body),
        o = f(i),
        r = n ? [o].concat(o.visualViewport || [], T(i) ? i : []) : i,
        a = t.concat(r);
      return n ? a : a.concat(N(D(r)));
    }
    function $(e) {
      return ["table", "td", "th"].indexOf(A(e)) >= 0;
    }
    function P(e) {
      return v(e) && "fixed" !== k(e).position ? e.offsetParent : null;
    }
    function j(e) {
      for (var t = f(e), s = P(e); s && $(s) && "static" === k(s).position; )
        s = P(s);
      return s &&
        ("html" === A(s) || ("body" === A(s) && "static" === k(s).position))
        ? t
        : s ||
            (function (e) {
              var t = /firefox/i.test(E());
              if (/Trident/i.test(E()) && v(e) && "fixed" === k(e).position)
                return null;
              var s = D(e);
              for (
                g(s) && (s = s.host);
                v(s) && ["html", "body"].indexOf(A(s)) < 0;

              ) {
                var i = k(s);
                if (
                  "none" !== i.transform ||
                  "none" !== i.perspective ||
                  "paint" === i.contain ||
                  -1 !== ["transform", "perspective"].indexOf(i.willChange) ||
                  (t && "filter" === i.willChange) ||
                  (t && i.filter && "none" !== i.filter)
                )
                  return s;
                s = s.parentNode;
              }
              return null;
            })(e) ||
            t;
    }
    var q = "top",
      H = "bottom",
      V = "right",
      z = "left",
      B = "auto",
      R = [q, H, V, z],
      I = "start",
      F = "end",
      Y = "clippingParents",
      X = "viewport",
      U = "popper",
      Z = "reference",
      Q = R.reduce(function (e, t) {
        return e.concat([t + "-" + I, t + "-" + F]);
      }, []),
      G = [].concat(R, [B]).reduce(function (e, t) {
        return e.concat([t, t + "-" + I, t + "-" + F]);
      }, []),
      J = [
        "beforeRead",
        "read",
        "afterRead",
        "beforeMain",
        "main",
        "afterMain",
        "beforeWrite",
        "write",
        "afterWrite",
      ];
    function K(e) {
      var t = new Map(),
        s = new Set(),
        i = [];
      function n(e) {
        s.add(e.name),
          []
            .concat(e.requires || [], e.requiresIfExists || [])
            .forEach(function (e) {
              if (!s.has(e)) {
                var i = t.get(e);
                i && n(i);
              }
            }),
          i.push(e);
      }
      return (
        e.forEach(function (e) {
          t.set(e.name, e);
        }),
        e.forEach(function (e) {
          s.has(e.name) || n(e);
        }),
        i
      );
    }
    var ee = { placement: "bottom", modifiers: [], strategy: "absolute" };
    function te() {
      for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
        t[s] = arguments[s];
      return !t.some(function (e) {
        return !(e && "function" == typeof e.getBoundingClientRect);
      });
    }
    function se(e) {
      void 0 === e && (e = {});
      var t = e,
        s = t.defaultModifiers,
        i = void 0 === s ? [] : s,
        n = t.defaultOptions,
        o = void 0 === n ? ee : n;
      return function (e, t, s) {
        void 0 === s && (s = o);
        var n,
          r,
          a = {
            placement: "bottom",
            orderedModifiers: [],
            options: Object.assign({}, ee, o),
            modifiersData: {},
            elements: { reference: e, popper: t },
            attributes: {},
            styles: {},
          },
          l = [],
          c = !1,
          u = {
            state: a,
            setOptions: function (s) {
              var n = "function" == typeof s ? s(a.options) : s;
              d(),
                (a.options = Object.assign({}, o, a.options, n)),
                (a.scrollParents = {
                  reference: m(e)
                    ? N(e)
                    : e.contextElement
                    ? N(e.contextElement)
                    : [],
                  popper: N(t),
                });
              var r,
                c,
                p = (function (e) {
                  var t = K(e);
                  return J.reduce(function (e, s) {
                    return e.concat(
                      t.filter(function (e) {
                        return e.phase === s;
                      }),
                    );
                  }, []);
                })(
                  ((r = [].concat(i, a.options.modifiers)),
                  (c = r.reduce(function (e, t) {
                    var s = e[t.name];
                    return (
                      (e[t.name] = s
                        ? Object.assign({}, s, t, {
                            options: Object.assign({}, s.options, t.options),
                            data: Object.assign({}, s.data, t.data),
                          })
                        : t),
                      e
                    );
                  }, {})),
                  Object.keys(c).map(function (e) {
                    return c[e];
                  })),
                );
              return (
                (a.orderedModifiers = p.filter(function (e) {
                  return e.enabled;
                })),
                a.orderedModifiers.forEach(function (e) {
                  var t = e.name,
                    s = e.options,
                    i = void 0 === s ? {} : s,
                    n = e.effect;
                  if ("function" == typeof n) {
                    var o = n({ state: a, name: t, instance: u, options: i }),
                      r = function () {};
                    l.push(o || r);
                  }
                }),
                u.update()
              );
            },
            forceUpdate: function () {
              if (!c) {
                var e = a.elements,
                  t = e.reference,
                  s = e.popper;
                if (te(t, s)) {
                  (a.rects = {
                    reference: _(t, j(s), "fixed" === a.options.strategy),
                    popper: M(s),
                  }),
                    (a.reset = !1),
                    (a.placement = a.options.placement),
                    a.orderedModifiers.forEach(function (e) {
                      return (a.modifiersData[e.name] = Object.assign(
                        {},
                        e.data,
                      ));
                    });
                  for (var i = 0; i < a.orderedModifiers.length; i++)
                    if (!0 !== a.reset) {
                      var n = a.orderedModifiers[i],
                        o = n.fn,
                        r = n.options,
                        l = void 0 === r ? {} : r,
                        d = n.name;
                      "function" == typeof o &&
                        (a =
                          o({ state: a, options: l, name: d, instance: u }) ||
                          a);
                    } else (a.reset = !1), (i = -1);
                }
              }
            },
            update:
              ((n = function () {
                return new Promise(function (e) {
                  u.forceUpdate(), e(a);
                });
              }),
              function () {
                return (
                  r ||
                    (r = new Promise(function (e) {
                      Promise.resolve().then(function () {
                        (r = void 0), e(n());
                      });
                    })),
                  r
                );
              }),
            destroy: function () {
              d(), (c = !0);
            },
          };
        if (!te(e, t)) return u;
        function d() {
          l.forEach(function (e) {
            return e();
          }),
            (l = []);
        }
        return (
          u.setOptions(s).then(function (e) {
            !c && s.onFirstUpdate && s.onFirstUpdate(e);
          }),
          u
        );
      };
    }
    var ie = { passive: !0 };
    const ne = {
      name: "eventListeners",
      enabled: !0,
      phase: "write",
      fn: function () {},
      effect: function (e) {
        var t = e.state,
          s = e.instance,
          i = e.options,
          n = i.scroll,
          o = void 0 === n || n,
          r = i.resize,
          a = void 0 === r || r,
          l = f(t.elements.popper),
          c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
        return (
          o &&
            c.forEach(function (e) {
              e.addEventListener("scroll", s.update, ie);
            }),
          a && l.addEventListener("resize", s.update, ie),
          function () {
            o &&
              c.forEach(function (e) {
                e.removeEventListener("scroll", s.update, ie);
              }),
              a && l.removeEventListener("resize", s.update, ie);
          }
        );
      },
      data: {},
    };
    function oe(e) {
      return e.split("-")[0];
    }
    function re(e) {
      return e.split("-")[1];
    }
    function ae(e) {
      return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
    }
    function le(e) {
      var t,
        s = e.reference,
        i = e.element,
        n = e.placement,
        o = n ? oe(n) : null,
        r = n ? re(n) : null,
        a = s.x + s.width / 2 - i.width / 2,
        l = s.y + s.height / 2 - i.height / 2;
      switch (o) {
        case q:
          t = { x: a, y: s.y - i.height };
          break;
        case H:
          t = { x: a, y: s.y + s.height };
          break;
        case V:
          t = { x: s.x + s.width, y: l };
          break;
        case z:
          t = { x: s.x - i.width, y: l };
          break;
        default:
          t = { x: s.x, y: s.y };
      }
      var c = o ? ae(o) : null;
      if (null != c) {
        var u = "y" === c ? "height" : "width";
        switch (r) {
          case I:
            t[c] = t[c] - (s[u] / 2 - i[u] / 2);
            break;
          case F:
            t[c] = t[c] + (s[u] / 2 - i[u] / 2);
        }
      }
      return t;
    }
    var ce = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
    function ue(e) {
      var t,
        s = e.popper,
        i = e.popperRect,
        n = e.placement,
        o = e.variation,
        r = e.offsets,
        a = e.position,
        l = e.gpuAcceleration,
        c = e.adaptive,
        u = e.roundOffsets,
        d = e.isFixed,
        p = r.x,
        h = void 0 === p ? 0 : p,
        m = r.y,
        v = void 0 === m ? 0 : m,
        g = "function" == typeof u ? u({ x: h, y: v }) : { x: h, y: v };
      (h = g.x), (v = g.y);
      var b = r.hasOwnProperty("x"),
        y = r.hasOwnProperty("y"),
        E = z,
        w = q,
        S = window;
      if (c) {
        var O = j(s),
          A = "clientHeight",
          L = "clientWidth";
        if (
          (O === f(s) &&
            "static" !== k((O = C(s))).position &&
            "absolute" === a &&
            ((A = "scrollHeight"), (L = "scrollWidth")),
          n === q || ((n === z || n === V) && o === F))
        )
          (w = H),
            (v -=
              (d && O === S && S.visualViewport
                ? S.visualViewport.height
                : O[A]) - i.height),
            (v *= l ? 1 : -1);
        if (n === z || ((n === q || n === H) && o === F))
          (E = V),
            (h -=
              (d && O === S && S.visualViewport
                ? S.visualViewport.width
                : O[L]) - i.width),
            (h *= l ? 1 : -1);
      }
      var T,
        _ = Object.assign({ position: a }, c && ce),
        M =
          !0 === u
            ? (function (e, t) {
                var s = e.x,
                  i = e.y,
                  n = t.devicePixelRatio || 1;
                return { x: x(s * n) / n || 0, y: x(i * n) / n || 0 };
              })({ x: h, y: v }, f(s))
            : { x: h, y: v };
      return (
        (h = M.x),
        (v = M.y),
        l
          ? Object.assign(
              {},
              _,
              (((T = {})[w] = y ? "0" : ""),
              (T[E] = b ? "0" : ""),
              (T.transform =
                (S.devicePixelRatio || 1) <= 1
                  ? "translate(" + h + "px, " + v + "px)"
                  : "translate3d(" + h + "px, " + v + "px, 0)"),
              T),
            )
          : Object.assign(
              {},
              _,
              (((t = {})[w] = y ? v + "px" : ""),
              (t[E] = b ? h + "px" : ""),
              (t.transform = ""),
              t),
            )
      );
    }
    const de = {
      name: "computeStyles",
      enabled: !0,
      phase: "beforeWrite",
      fn: function (e) {
        var t = e.state,
          s = e.options,
          i = s.gpuAcceleration,
          n = void 0 === i || i,
          o = s.adaptive,
          r = void 0 === o || o,
          a = s.roundOffsets,
          l = void 0 === a || a,
          c = {
            placement: oe(t.placement),
            variation: re(t.placement),
            popper: t.elements.popper,
            popperRect: t.rects.popper,
            gpuAcceleration: n,
            isFixed: "fixed" === t.options.strategy,
          };
        null != t.modifiersData.popperOffsets &&
          (t.styles.popper = Object.assign(
            {},
            t.styles.popper,
            ue(
              Object.assign({}, c, {
                offsets: t.modifiersData.popperOffsets,
                position: t.options.strategy,
                adaptive: r,
                roundOffsets: l,
              }),
            ),
          )),
          null != t.modifiersData.arrow &&
            (t.styles.arrow = Object.assign(
              {},
              t.styles.arrow,
              ue(
                Object.assign({}, c, {
                  offsets: t.modifiersData.arrow,
                  position: "absolute",
                  adaptive: !1,
                  roundOffsets: l,
                }),
              ),
            )),
          (t.attributes.popper = Object.assign({}, t.attributes.popper, {
            "data-popper-placement": t.placement,
          }));
      },
      data: {},
    };
    const pe = {
      name: "applyStyles",
      enabled: !0,
      phase: "write",
      fn: function (e) {
        var t = e.state;
        Object.keys(t.elements).forEach(function (e) {
          var s = t.styles[e] || {},
            i = t.attributes[e] || {},
            n = t.elements[e];
          v(n) &&
            A(n) &&
            (Object.assign(n.style, s),
            Object.keys(i).forEach(function (e) {
              var t = i[e];
              !1 === t
                ? n.removeAttribute(e)
                : n.setAttribute(e, !0 === t ? "" : t);
            }));
        });
      },
      effect: function (e) {
        var t = e.state,
          s = {
            popper: {
              position: t.options.strategy,
              left: "0",
              top: "0",
              margin: "0",
            },
            arrow: { position: "absolute" },
            reference: {},
          };
        return (
          Object.assign(t.elements.popper.style, s.popper),
          (t.styles = s),
          t.elements.arrow && Object.assign(t.elements.arrow.style, s.arrow),
          function () {
            Object.keys(t.elements).forEach(function (e) {
              var i = t.elements[e],
                n = t.attributes[e] || {},
                o = Object.keys(
                  t.styles.hasOwnProperty(e) ? t.styles[e] : s[e],
                ).reduce(function (e, t) {
                  return (e[t] = ""), e;
                }, {});
              v(i) &&
                A(i) &&
                (Object.assign(i.style, o),
                Object.keys(n).forEach(function (e) {
                  i.removeAttribute(e);
                }));
            });
          }
        );
      },
      requires: ["computeStyles"],
    };
    const he = {
      name: "offset",
      enabled: !0,
      phase: "main",
      requires: ["popperOffsets"],
      fn: function (e) {
        var t = e.state,
          s = e.options,
          i = e.name,
          n = s.offset,
          o = void 0 === n ? [0, 0] : n,
          r = G.reduce(function (e, s) {
            return (
              (e[s] = (function (e, t, s) {
                var i = oe(e),
                  n = [z, q].indexOf(i) >= 0 ? -1 : 1,
                  o =
                    "function" == typeof s
                      ? s(Object.assign({}, t, { placement: e }))
                      : s,
                  r = o[0],
                  a = o[1];
                return (
                  (r = r || 0),
                  (a = (a || 0) * n),
                  [z, V].indexOf(i) >= 0 ? { x: a, y: r } : { x: r, y: a }
                );
              })(s, t.rects, o)),
              e
            );
          }, {}),
          a = r[t.placement],
          l = a.x,
          c = a.y;
        null != t.modifiersData.popperOffsets &&
          ((t.modifiersData.popperOffsets.x += l),
          (t.modifiersData.popperOffsets.y += c)),
          (t.modifiersData[i] = r);
      },
    };
    var fe = { left: "right", right: "left", bottom: "top", top: "bottom" };
    function me(e) {
      return e.replace(/left|right|bottom|top/g, function (e) {
        return fe[e];
      });
    }
    var ve = { start: "end", end: "start" };
    function ge(e) {
      return e.replace(/start|end/g, function (e) {
        return ve[e];
      });
    }
    function be(e, t) {
      var s = t.getRootNode && t.getRootNode();
      if (e.contains(t)) return !0;
      if (s && g(s)) {
        var i = t;
        do {
          if (i && e.isSameNode(i)) return !0;
          i = i.parentNode || i.host;
        } while (i);
      }
      return !1;
    }
    function ye(e) {
      return Object.assign({}, e, {
        left: e.x,
        top: e.y,
        right: e.x + e.width,
        bottom: e.y + e.height,
      });
    }
    function xe(e, t, s) {
      return t === X
        ? ye(
            (function (e, t) {
              var s = f(e),
                i = C(e),
                n = s.visualViewport,
                o = i.clientWidth,
                r = i.clientHeight,
                a = 0,
                l = 0;
              if (n) {
                (o = n.width), (r = n.height);
                var c = w();
                (c || (!c && "fixed" === t)) &&
                  ((a = n.offsetLeft), (l = n.offsetTop));
              }
              return { width: o, height: r, x: a + L(e), y: l };
            })(e, s),
          )
        : m(t)
        ? (function (e, t) {
            var s = S(e, !1, "fixed" === t);
            return (
              (s.top = s.top + e.clientTop),
              (s.left = s.left + e.clientLeft),
              (s.bottom = s.top + e.clientHeight),
              (s.right = s.left + e.clientWidth),
              (s.width = e.clientWidth),
              (s.height = e.clientHeight),
              (s.x = s.left),
              (s.y = s.top),
              s
            );
          })(t, s)
        : ye(
            (function (e) {
              var t,
                s = C(e),
                i = O(e),
                n = null == (t = e.ownerDocument) ? void 0 : t.body,
                o = b(
                  s.scrollWidth,
                  s.clientWidth,
                  n ? n.scrollWidth : 0,
                  n ? n.clientWidth : 0,
                ),
                r = b(
                  s.scrollHeight,
                  s.clientHeight,
                  n ? n.scrollHeight : 0,
                  n ? n.clientHeight : 0,
                ),
                a = -i.scrollLeft + L(e),
                l = -i.scrollTop;
              return (
                "rtl" === k(n || s).direction &&
                  (a += b(s.clientWidth, n ? n.clientWidth : 0) - o),
                { width: o, height: r, x: a, y: l }
              );
            })(C(e)),
          );
    }
    function Ee(e, t, s, i) {
      var n =
          "clippingParents" === t
            ? (function (e) {
                var t = N(D(e)),
                  s =
                    ["absolute", "fixed"].indexOf(k(e).position) >= 0 && v(e)
                      ? j(e)
                      : e;
                return m(s)
                  ? t.filter(function (e) {
                      return m(e) && be(e, s) && "body" !== A(e);
                    })
                  : [];
              })(e)
            : [].concat(t),
        o = [].concat(n, [s]),
        r = o[0],
        a = o.reduce(
          function (t, s) {
            var n = xe(e, s, i);
            return (
              (t.top = b(n.top, t.top)),
              (t.right = y(n.right, t.right)),
              (t.bottom = y(n.bottom, t.bottom)),
              (t.left = b(n.left, t.left)),
              t
            );
          },
          xe(e, r, i),
        );
      return (
        (a.width = a.right - a.left),
        (a.height = a.bottom - a.top),
        (a.x = a.left),
        (a.y = a.top),
        a
      );
    }
    function we(e) {
      return Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }, e);
    }
    function Se(e, t) {
      return t.reduce(function (t, s) {
        return (t[s] = e), t;
      }, {});
    }
    function Oe(e, t) {
      void 0 === t && (t = {});
      var s = t,
        i = s.placement,
        n = void 0 === i ? e.placement : i,
        o = s.strategy,
        r = void 0 === o ? e.strategy : o,
        a = s.boundary,
        l = void 0 === a ? Y : a,
        c = s.rootBoundary,
        u = void 0 === c ? X : c,
        d = s.elementContext,
        p = void 0 === d ? U : d,
        h = s.altBoundary,
        f = void 0 !== h && h,
        v = s.padding,
        g = void 0 === v ? 0 : v,
        b = we("number" != typeof g ? g : Se(g, R)),
        y = p === U ? Z : U,
        x = e.rects.popper,
        E = e.elements[f ? y : p],
        w = Ee(m(E) ? E : E.contextElement || C(e.elements.popper), l, u, r),
        O = S(e.elements.reference),
        A = le({
          reference: O,
          element: x,
          strategy: "absolute",
          placement: n,
        }),
        L = ye(Object.assign({}, x, A)),
        k = p === U ? L : O,
        T = {
          top: w.top - k.top + b.top,
          bottom: k.bottom - w.bottom + b.bottom,
          left: w.left - k.left + b.left,
          right: k.right - w.right + b.right,
        },
        _ = e.modifiersData.offset;
      if (p === U && _) {
        var M = _[n];
        Object.keys(T).forEach(function (e) {
          var t = [V, H].indexOf(e) >= 0 ? 1 : -1,
            s = [q, H].indexOf(e) >= 0 ? "y" : "x";
          T[e] += M[s] * t;
        });
      }
      return T;
    }
    const Ae = {
      name: "flip",
      enabled: !0,
      phase: "main",
      fn: function (e) {
        var t = e.state,
          s = e.options,
          i = e.name;
        if (!t.modifiersData[i]._skip) {
          for (
            var n = s.mainAxis,
              o = void 0 === n || n,
              r = s.altAxis,
              a = void 0 === r || r,
              l = s.fallbackPlacements,
              c = s.padding,
              u = s.boundary,
              d = s.rootBoundary,
              p = s.altBoundary,
              h = s.flipVariations,
              f = void 0 === h || h,
              m = s.allowedAutoPlacements,
              v = t.options.placement,
              g = oe(v),
              b =
                l ||
                (g === v || !f
                  ? [me(v)]
                  : (function (e) {
                      if (oe(e) === B) return [];
                      var t = me(e);
                      return [ge(e), t, ge(t)];
                    })(v)),
              y = [v].concat(b).reduce(function (e, s) {
                return e.concat(
                  oe(s) === B
                    ? (function (e, t) {
                        void 0 === t && (t = {});
                        var s = t,
                          i = s.placement,
                          n = s.boundary,
                          o = s.rootBoundary,
                          r = s.padding,
                          a = s.flipVariations,
                          l = s.allowedAutoPlacements,
                          c = void 0 === l ? G : l,
                          u = re(i),
                          d = u
                            ? a
                              ? Q
                              : Q.filter(function (e) {
                                  return re(e) === u;
                                })
                            : R,
                          p = d.filter(function (e) {
                            return c.indexOf(e) >= 0;
                          });
                        0 === p.length && (p = d);
                        var h = p.reduce(function (t, s) {
                          return (
                            (t[s] = Oe(e, {
                              placement: s,
                              boundary: n,
                              rootBoundary: o,
                              padding: r,
                            })[oe(s)]),
                            t
                          );
                        }, {});
                        return Object.keys(h).sort(function (e, t) {
                          return h[e] - h[t];
                        });
                      })(t, {
                        placement: s,
                        boundary: u,
                        rootBoundary: d,
                        padding: c,
                        flipVariations: f,
                        allowedAutoPlacements: m,
                      })
                    : s,
                );
              }, []),
              x = t.rects.reference,
              E = t.rects.popper,
              w = new Map(),
              S = !0,
              O = y[0],
              A = 0;
            A < y.length;
            A++
          ) {
            var C = y[A],
              L = oe(C),
              k = re(C) === I,
              T = [q, H].indexOf(L) >= 0,
              _ = T ? "width" : "height",
              M = Oe(t, {
                placement: C,
                boundary: u,
                rootBoundary: d,
                altBoundary: p,
                padding: c,
              }),
              D = T ? (k ? V : z) : k ? H : q;
            x[_] > E[_] && (D = me(D));
            var W = me(D),
              N = [];
            if (
              (o && N.push(M[L] <= 0),
              a && N.push(M[D] <= 0, M[W] <= 0),
              N.every(function (e) {
                return e;
              }))
            ) {
              (O = C), (S = !1);
              break;
            }
            w.set(C, N);
          }
          if (S)
            for (
              var $ = function (e) {
                  var t = y.find(function (t) {
                    var s = w.get(t);
                    if (s)
                      return s.slice(0, e).every(function (e) {
                        return e;
                      });
                  });
                  if (t) return (O = t), "break";
                },
                P = f ? 3 : 1;
              P > 0;
              P--
            ) {
              if ("break" === $(P)) break;
            }
          t.placement !== O &&
            ((t.modifiersData[i]._skip = !0),
            (t.placement = O),
            (t.reset = !0));
        }
      },
      requiresIfExists: ["offset"],
      data: { _skip: !1 },
    };
    function Ce(e, t, s) {
      return b(e, y(t, s));
    }
    const Le = {
      name: "preventOverflow",
      enabled: !0,
      phase: "main",
      fn: function (e) {
        var t = e.state,
          s = e.options,
          i = e.name,
          n = s.mainAxis,
          o = void 0 === n || n,
          r = s.altAxis,
          a = void 0 !== r && r,
          l = s.boundary,
          c = s.rootBoundary,
          u = s.altBoundary,
          d = s.padding,
          p = s.tether,
          h = void 0 === p || p,
          f = s.tetherOffset,
          m = void 0 === f ? 0 : f,
          v = Oe(t, {
            boundary: l,
            rootBoundary: c,
            padding: d,
            altBoundary: u,
          }),
          g = oe(t.placement),
          x = re(t.placement),
          E = !x,
          w = ae(g),
          S = "x" === w ? "y" : "x",
          O = t.modifiersData.popperOffsets,
          A = t.rects.reference,
          C = t.rects.popper,
          L =
            "function" == typeof m
              ? m(Object.assign({}, t.rects, { placement: t.placement }))
              : m,
          k =
            "number" == typeof L
              ? { mainAxis: L, altAxis: L }
              : Object.assign({ mainAxis: 0, altAxis: 0 }, L),
          T = t.modifiersData.offset
            ? t.modifiersData.offset[t.placement]
            : null,
          _ = { x: 0, y: 0 };
        if (O) {
          if (o) {
            var D,
              W = "y" === w ? q : z,
              N = "y" === w ? H : V,
              $ = "y" === w ? "height" : "width",
              P = O[w],
              B = P + v[W],
              R = P - v[N],
              F = h ? -C[$] / 2 : 0,
              Y = x === I ? A[$] : C[$],
              X = x === I ? -C[$] : -A[$],
              U = t.elements.arrow,
              Z = h && U ? M(U) : { width: 0, height: 0 },
              Q = t.modifiersData["arrow#persistent"]
                ? t.modifiersData["arrow#persistent"].padding
                : { top: 0, right: 0, bottom: 0, left: 0 },
              G = Q[W],
              J = Q[N],
              K = Ce(0, A[$], Z[$]),
              ee = E
                ? A[$] / 2 - F - K - G - k.mainAxis
                : Y - K - G - k.mainAxis,
              te = E
                ? -A[$] / 2 + F + K + J + k.mainAxis
                : X + K + J + k.mainAxis,
              se = t.elements.arrow && j(t.elements.arrow),
              ie = se
                ? "y" === w
                  ? se.clientTop || 0
                  : se.clientLeft || 0
                : 0,
              ne = null != (D = null == T ? void 0 : T[w]) ? D : 0,
              le = P + te - ne,
              ce = Ce(h ? y(B, P + ee - ne - ie) : B, P, h ? b(R, le) : R);
            (O[w] = ce), (_[w] = ce - P);
          }
          if (a) {
            var ue,
              de = "x" === w ? q : z,
              pe = "x" === w ? H : V,
              he = O[S],
              fe = "y" === S ? "height" : "width",
              me = he + v[de],
              ve = he - v[pe],
              ge = -1 !== [q, z].indexOf(g),
              be = null != (ue = null == T ? void 0 : T[S]) ? ue : 0,
              ye = ge ? me : he - A[fe] - C[fe] - be + k.altAxis,
              xe = ge ? he + A[fe] + C[fe] - be - k.altAxis : ve,
              Ee =
                h && ge
                  ? (function (e, t, s) {
                      var i = Ce(e, t, s);
                      return i > s ? s : i;
                    })(ye, he, xe)
                  : Ce(h ? ye : me, he, h ? xe : ve);
            (O[S] = Ee), (_[S] = Ee - he);
          }
          t.modifiersData[i] = _;
        }
      },
      requiresIfExists: ["offset"],
    };
    const ke = {
      name: "arrow",
      enabled: !0,
      phase: "main",
      fn: function (e) {
        var t,
          s = e.state,
          i = e.name,
          n = e.options,
          o = s.elements.arrow,
          r = s.modifiersData.popperOffsets,
          a = oe(s.placement),
          l = ae(a),
          c = [z, V].indexOf(a) >= 0 ? "height" : "width";
        if (o && r) {
          var u = (function (e, t) {
              return we(
                "number" !=
                  typeof (e =
                    "function" == typeof e
                      ? e(
                          Object.assign({}, t.rects, {
                            placement: t.placement,
                          }),
                        )
                      : e)
                  ? e
                  : Se(e, R),
              );
            })(n.padding, s),
            d = M(o),
            p = "y" === l ? q : z,
            h = "y" === l ? H : V,
            f =
              s.rects.reference[c] +
              s.rects.reference[l] -
              r[l] -
              s.rects.popper[c],
            m = r[l] - s.rects.reference[l],
            v = j(o),
            g = v ? ("y" === l ? v.clientHeight || 0 : v.clientWidth || 0) : 0,
            b = f / 2 - m / 2,
            y = u[p],
            x = g - d[c] - u[h],
            E = g / 2 - d[c] / 2 + b,
            w = Ce(y, E, x),
            S = l;
          s.modifiersData[i] = (((t = {})[S] = w), (t.centerOffset = w - E), t);
        }
      },
      effect: function (e) {
        var t = e.state,
          s = e.options.element,
          i = void 0 === s ? "[data-popper-arrow]" : s;
        null != i &&
          ("string" != typeof i || (i = t.elements.popper.querySelector(i))) &&
          be(t.elements.popper, i) &&
          (t.elements.arrow = i);
      },
      requires: ["popperOffsets"],
      requiresIfExists: ["preventOverflow"],
    };
    function Te(e, t, s) {
      return (
        void 0 === s && (s = { x: 0, y: 0 }),
        {
          top: e.top - t.height - s.y,
          right: e.right - t.width + s.x,
          bottom: e.bottom - t.height + s.y,
          left: e.left - t.width - s.x,
        }
      );
    }
    function _e(e) {
      return [q, V, H, z].some(function (t) {
        return e[t] >= 0;
      });
    }
    var Me = se({
        defaultModifiers: [
          ne,
          {
            name: "popperOffsets",
            enabled: !0,
            phase: "read",
            fn: function (e) {
              var t = e.state,
                s = e.name;
              t.modifiersData[s] = le({
                reference: t.rects.reference,
                element: t.rects.popper,
                strategy: "absolute",
                placement: t.placement,
              });
            },
            data: {},
          },
          de,
          pe,
          he,
          Ae,
          Le,
          ke,
          {
            name: "hide",
            enabled: !0,
            phase: "main",
            requiresIfExists: ["preventOverflow"],
            fn: function (e) {
              var t = e.state,
                s = e.name,
                i = t.rects.reference,
                n = t.rects.popper,
                o = t.modifiersData.preventOverflow,
                r = Oe(t, { elementContext: "reference" }),
                a = Oe(t, { altBoundary: !0 }),
                l = Te(r, i),
                c = Te(a, n, o),
                u = _e(l),
                d = _e(c);
              (t.modifiersData[s] = {
                referenceClippingOffsets: l,
                popperEscapeOffsets: c,
                isReferenceHidden: u,
                hasPopperEscaped: d,
              }),
                (t.attributes.popper = Object.assign({}, t.attributes.popper, {
                  "data-popper-reference-hidden": u,
                  "data-popper-escaped": d,
                }));
            },
          },
        ],
      }),
      De = "tippy-content",
      We = "tippy-backdrop",
      Ne = "tippy-arrow",
      $e = "tippy-svg-arrow",
      Pe = { passive: !0, capture: !0 },
      je = function () {
        return document.body;
      };
    function qe(e, t, s) {
      if (Array.isArray(e)) {
        var i = e[t];
        return null == i ? (Array.isArray(s) ? s[t] : s) : i;
      }
      return e;
    }
    function He(e, t) {
      var s = {}.toString.call(e);
      return 0 === s.indexOf("[object") && s.indexOf(t + "]") > -1;
    }
    function Ve(e, t) {
      return "function" == typeof e ? e.apply(void 0, t) : e;
    }
    function ze(e, t) {
      return 0 === t
        ? e
        : function (i) {
            clearTimeout(s),
              (s = setTimeout(function () {
                e(i);
              }, t));
          };
      var s;
    }
    function Be(e) {
      return [].concat(e);
    }
    function Re(e, t) {
      -1 === e.indexOf(t) && e.push(t);
    }
    function Ie(e) {
      return e.split("-")[0];
    }
    function Fe(e) {
      return [].slice.call(e);
    }
    function Ye(e) {
      return Object.keys(e).reduce(function (t, s) {
        return void 0 !== e[s] && (t[s] = e[s]), t;
      }, {});
    }
    function Xe() {
      return document.createElement("div");
    }
    function Ue(e) {
      return ["Element", "Fragment"].some(function (t) {
        return He(e, t);
      });
    }
    function Ze(e) {
      return He(e, "MouseEvent");
    }
    function Qe(e) {
      return !(!e || !e._tippy || e._tippy.reference !== e);
    }
    function Ge(e) {
      return Ue(e)
        ? [e]
        : (function (e) {
            return He(e, "NodeList");
          })(e)
        ? Fe(e)
        : Array.isArray(e)
        ? e
        : Fe(document.querySelectorAll(e));
    }
    function Je(e, t) {
      e.forEach(function (e) {
        e && (e.style.transitionDuration = t + "ms");
      });
    }
    function Ke(e, t) {
      e.forEach(function (e) {
        e && e.setAttribute("data-state", t);
      });
    }
    function et(e) {
      var t,
        s = Be(e)[0];
      return null != s && null != (t = s.ownerDocument) && t.body
        ? s.ownerDocument
        : document;
    }
    function tt(e, t, s) {
      var i = t + "EventListener";
      ["transitionend", "webkitTransitionEnd"].forEach(function (t) {
        e[i](t, s);
      });
    }
    function st(e, t) {
      for (var s = t; s; ) {
        var i;
        if (e.contains(s)) return !0;
        s =
          null == s.getRootNode || null == (i = s.getRootNode())
            ? void 0
            : i.host;
      }
      return !1;
    }
    var it = { isTouch: !1 },
      nt = 0;
    function ot() {
      it.isTouch ||
        ((it.isTouch = !0),
        window.performance && document.addEventListener("mousemove", rt));
    }
    function rt() {
      var e = performance.now();
      e - nt < 20 &&
        ((it.isTouch = !1), document.removeEventListener("mousemove", rt)),
        (nt = e);
    }
    function at() {
      var e = document.activeElement;
      if (Qe(e)) {
        var t = e._tippy;
        e.blur && !t.state.isVisible && e.blur();
      }
    }
    var lt =
      !!("undefined" != typeof window && "undefined" != typeof document) &&
      !!window.msCrypto;
    var ct = {
        animateFill: !1,
        followCursor: !1,
        inlinePositioning: !1,
        sticky: !1,
      },
      ut = Object.assign(
        {
          appendTo: je,
          aria: { content: "auto", expanded: "auto" },
          delay: 0,
          duration: [300, 250],
          getReferenceClientRect: null,
          hideOnClick: !0,
          ignoreAttributes: !1,
          interactive: !1,
          interactiveBorder: 2,
          interactiveDebounce: 0,
          moveTransition: "",
          offset: [0, 10],
          onAfterUpdate: function () {},
          onBeforeUpdate: function () {},
          onCreate: function () {},
          onDestroy: function () {},
          onHidden: function () {},
          onHide: function () {},
          onMount: function () {},
          onShow: function () {},
          onShown: function () {},
          onTrigger: function () {},
          onUntrigger: function () {},
          onClickOutside: function () {},
          placement: "top",
          plugins: [],
          popperOptions: {},
          render: null,
          showOnCreate: !1,
          touch: !0,
          trigger: "mouseenter focus",
          triggerTarget: null,
        },
        ct,
        {
          allowHTML: !1,
          animation: "fade",
          arrow: !0,
          content: "",
          inertia: !1,
          maxWidth: 350,
          role: "tooltip",
          theme: "",
          zIndex: 9999,
        },
      ),
      dt = Object.keys(ut);
    function pt(e) {
      var t = (e.plugins || []).reduce(function (t, s) {
        var i,
          n = s.name,
          o = s.defaultValue;
        n && (t[n] = void 0 !== e[n] ? e[n] : null != (i = ut[n]) ? i : o);
        return t;
      }, {});
      return Object.assign({}, e, t);
    }
    function ht(e, t) {
      var s = Object.assign(
        {},
        t,
        { content: Ve(t.content, [e]) },
        t.ignoreAttributes
          ? {}
          : (function (e, t) {
              return (
                t ? Object.keys(pt(Object.assign({}, ut, { plugins: t }))) : dt
              ).reduce(function (t, s) {
                var i = (e.getAttribute("data-tippy-" + s) || "").trim();
                if (!i) return t;
                if ("content" === s) t[s] = i;
                else
                  try {
                    t[s] = JSON.parse(i);
                  } catch (e) {
                    t[s] = i;
                  }
                return t;
              }, {});
            })(e, t.plugins),
      );
      return (
        (s.aria = Object.assign({}, ut.aria, s.aria)),
        (s.aria = {
          expanded:
            "auto" === s.aria.expanded ? t.interactive : s.aria.expanded,
          content:
            "auto" === s.aria.content
              ? t.interactive
                ? null
                : "describedby"
              : s.aria.content,
        }),
        s
      );
    }
    var ft = function () {
      return "innerHTML";
    };
    function mt(e, t) {
      e[ft()] = t;
    }
    function vt(e) {
      var t = Xe();
      return (
        !0 === e
          ? (t.className = Ne)
          : ((t.className = $e), Ue(e) ? t.appendChild(e) : mt(t, e)),
        t
      );
    }
    function gt(e, t) {
      Ue(t.content)
        ? (mt(e, ""), e.appendChild(t.content))
        : "function" != typeof t.content &&
          (t.allowHTML ? mt(e, t.content) : (e.textContent = t.content));
    }
    function bt(e) {
      var t = e.firstElementChild,
        s = Fe(t.children);
      return {
        box: t,
        content: s.find(function (e) {
          return e.classList.contains(De);
        }),
        arrow: s.find(function (e) {
          return e.classList.contains(Ne) || e.classList.contains($e);
        }),
        backdrop: s.find(function (e) {
          return e.classList.contains(We);
        }),
      };
    }
    function yt(e) {
      var t = Xe(),
        s = Xe();
      (s.className = "tippy-box"),
        s.setAttribute("data-state", "hidden"),
        s.setAttribute("tabindex", "-1");
      var i = Xe();
      function n(s, i) {
        var n = bt(t),
          o = n.box,
          r = n.content,
          a = n.arrow;
        i.theme
          ? o.setAttribute("data-theme", i.theme)
          : o.removeAttribute("data-theme"),
          "string" == typeof i.animation
            ? o.setAttribute("data-animation", i.animation)
            : o.removeAttribute("data-animation"),
          i.inertia
            ? o.setAttribute("data-inertia", "")
            : o.removeAttribute("data-inertia"),
          (o.style.maxWidth =
            "number" == typeof i.maxWidth ? i.maxWidth + "px" : i.maxWidth),
          i.role ? o.setAttribute("role", i.role) : o.removeAttribute("role"),
          (s.content === i.content && s.allowHTML === i.allowHTML) ||
            gt(r, e.props),
          i.arrow
            ? a
              ? s.arrow !== i.arrow &&
                (o.removeChild(a), o.appendChild(vt(i.arrow)))
              : o.appendChild(vt(i.arrow))
            : a && o.removeChild(a);
      }
      return (
        (i.className = De),
        i.setAttribute("data-state", "hidden"),
        gt(i, e.props),
        t.appendChild(s),
        s.appendChild(i),
        n(e.props, e.props),
        { popper: t, onUpdate: n }
      );
    }
    yt.$$tippy = !0;
    var xt = 1,
      Et = [],
      wt = [];
    function St(e, t) {
      var s,
        i,
        n,
        o,
        r,
        a,
        l,
        c,
        u = ht(e, Object.assign({}, ut, pt(Ye(t)))),
        d = !1,
        p = !1,
        h = !1,
        f = !1,
        m = [],
        v = ze(X, u.interactiveDebounce),
        g = xt++,
        b = (c = u.plugins).filter(function (e, t) {
          return c.indexOf(e) === t;
        }),
        y = {
          id: g,
          reference: e,
          popper: Xe(),
          popperInstance: null,
          props: u,
          state: {
            isEnabled: !0,
            isVisible: !1,
            isDestroyed: !1,
            isMounted: !1,
            isShown: !1,
          },
          plugins: b,
          clearDelayTimeouts: function () {
            clearTimeout(s), clearTimeout(i), cancelAnimationFrame(n);
          },
          setProps: function (t) {
            0;
            if (y.state.isDestroyed) return;
            W("onBeforeUpdate", [y, t]), F();
            var s = y.props,
              i = ht(e, Object.assign({}, s, Ye(t), { ignoreAttributes: !0 }));
            (y.props = i),
              I(),
              s.interactiveDebounce !== i.interactiveDebounce &&
                (P(), (v = ze(X, i.interactiveDebounce)));
            s.triggerTarget && !i.triggerTarget
              ? Be(s.triggerTarget).forEach(function (e) {
                  e.removeAttribute("aria-expanded");
                })
              : i.triggerTarget && e.removeAttribute("aria-expanded");
            $(), D(), w && w(s, i);
            y.popperInstance &&
              (G(),
              K().forEach(function (e) {
                requestAnimationFrame(e._tippy.popperInstance.forceUpdate);
              }));
            W("onAfterUpdate", [y, t]);
          },
          setContent: function (e) {
            y.setProps({ content: e });
          },
          show: function () {
            0;
            var e = y.state.isVisible,
              t = y.state.isDestroyed,
              s = !y.state.isEnabled,
              i = it.isTouch && !y.props.touch,
              n = qe(y.props.duration, 0, ut.duration);
            if (e || t || s || i) return;
            if (k().hasAttribute("disabled")) return;
            if ((W("onShow", [y], !1), !1 === y.props.onShow(y))) return;
            (y.state.isVisible = !0), L() && (E.style.visibility = "visible");
            D(), V(), y.state.isMounted || (E.style.transition = "none");
            if (L()) {
              var o = _();
              Je([o.box, o.content], 0);
            }
            (a = function () {
              var e;
              if (y.state.isVisible && !f) {
                if (
                  ((f = !0),
                  E.offsetHeight,
                  (E.style.transition = y.props.moveTransition),
                  L() && y.props.animation)
                ) {
                  var t = _(),
                    s = t.box,
                    i = t.content;
                  Je([s, i], n), Ke([s, i], "visible");
                }
                N(),
                  $(),
                  Re(wt, y),
                  null == (e = y.popperInstance) || e.forceUpdate(),
                  W("onMount", [y]),
                  y.props.animation &&
                    L() &&
                    (function (e, t) {
                      B(e, t);
                    })(n, function () {
                      (y.state.isShown = !0), W("onShown", [y]);
                    });
              }
            }),
              (function () {
                var e,
                  t = y.props.appendTo,
                  s = k();
                e =
                  (y.props.interactive && t === je) || "parent" === t
                    ? s.parentNode
                    : Ve(t, [s]);
                e.contains(E) || e.appendChild(E);
                (y.state.isMounted = !0), G(), !1;
              })();
          },
          hide: function () {
            0;
            var e = !y.state.isVisible,
              t = y.state.isDestroyed,
              s = !y.state.isEnabled,
              i = qe(y.props.duration, 1, ut.duration);
            if (e || t || s) return;
            if ((W("onHide", [y], !1), !1 === y.props.onHide(y))) return;
            (y.state.isVisible = !1),
              (y.state.isShown = !1),
              (f = !1),
              (d = !1),
              L() && (E.style.visibility = "hidden");
            if ((P(), z(), D(!0), L())) {
              var n = _(),
                o = n.box,
                r = n.content;
              y.props.animation && (Je([o, r], i), Ke([o, r], "hidden"));
            }
            N(),
              $(),
              y.props.animation
                ? L() &&
                  (function (e, t) {
                    B(e, function () {
                      !y.state.isVisible &&
                        E.parentNode &&
                        E.parentNode.contains(E) &&
                        t();
                    });
                  })(i, y.unmount)
                : y.unmount();
          },
          hideWithInteractivity: function (e) {
            0;
            T().addEventListener("mousemove", v), Re(Et, v), v(e);
          },
          enable: function () {
            y.state.isEnabled = !0;
          },
          disable: function () {
            y.hide(), (y.state.isEnabled = !1);
          },
          unmount: function () {
            0;
            y.state.isVisible && y.hide();
            if (!y.state.isMounted) return;
            J(),
              K().forEach(function (e) {
                e._tippy.unmount();
              }),
              E.parentNode && E.parentNode.removeChild(E);
            (wt = wt.filter(function (e) {
              return e !== y;
            })),
              (y.state.isMounted = !1),
              W("onHidden", [y]);
          },
          destroy: function () {
            0;
            if (y.state.isDestroyed) return;
            y.clearDelayTimeouts(),
              y.unmount(),
              F(),
              delete e._tippy,
              (y.state.isDestroyed = !0),
              W("onDestroy", [y]);
          },
        };
      if (!u.render) return y;
      var x = u.render(y),
        E = x.popper,
        w = x.onUpdate;
      E.setAttribute("data-tippy-root", ""),
        (E.id = "tippy-" + y.id),
        (y.popper = E),
        (e._tippy = y),
        (E._tippy = y);
      var S = b.map(function (e) {
          return e.fn(y);
        }),
        O = e.hasAttribute("aria-expanded");
      return (
        I(),
        $(),
        D(),
        W("onCreate", [y]),
        u.showOnCreate && ee(),
        E.addEventListener("mouseenter", function () {
          y.props.interactive && y.state.isVisible && y.clearDelayTimeouts();
        }),
        E.addEventListener("mouseleave", function () {
          y.props.interactive &&
            y.props.trigger.indexOf("mouseenter") >= 0 &&
            T().addEventListener("mousemove", v);
        }),
        y
      );
      function A() {
        var e = y.props.touch;
        return Array.isArray(e) ? e : [e, 0];
      }
      function C() {
        return "hold" === A()[0];
      }
      function L() {
        var e;
        return !(null == (e = y.props.render) || !e.$$tippy);
      }
      function k() {
        return l || e;
      }
      function T() {
        var e = k().parentNode;
        return e ? et(e) : document;
      }
      function _() {
        return bt(E);
      }
      function M(e) {
        return (y.state.isMounted && !y.state.isVisible) ||
          it.isTouch ||
          (o && "focus" === o.type)
          ? 0
          : qe(y.props.delay, e ? 0 : 1, ut.delay);
      }
      function D(e) {
        void 0 === e && (e = !1),
          (E.style.pointerEvents = y.props.interactive && !e ? "" : "none"),
          (E.style.zIndex = "" + y.props.zIndex);
      }
      function W(e, t, s) {
        var i;
        (void 0 === s && (s = !0),
        S.forEach(function (s) {
          s[e] && s[e].apply(s, t);
        }),
        s) && (i = y.props)[e].apply(i, t);
      }
      function N() {
        var t = y.props.aria;
        if (t.content) {
          var s = "aria-" + t.content,
            i = E.id;
          Be(y.props.triggerTarget || e).forEach(function (e) {
            var t = e.getAttribute(s);
            if (y.state.isVisible) e.setAttribute(s, t ? t + " " + i : i);
            else {
              var n = t && t.replace(i, "").trim();
              n ? e.setAttribute(s, n) : e.removeAttribute(s);
            }
          });
        }
      }
      function $() {
        !O &&
          y.props.aria.expanded &&
          Be(y.props.triggerTarget || e).forEach(function (e) {
            y.props.interactive
              ? e.setAttribute(
                  "aria-expanded",
                  y.state.isVisible && e === k() ? "true" : "false",
                )
              : e.removeAttribute("aria-expanded");
          });
      }
      function P() {
        T().removeEventListener("mousemove", v),
          (Et = Et.filter(function (e) {
            return e !== v;
          }));
      }
      function j(t) {
        if (!it.isTouch || (!h && "mousedown" !== t.type)) {
          var s = (t.composedPath && t.composedPath()[0]) || t.target;
          if (!y.props.interactive || !st(E, s)) {
            if (
              Be(y.props.triggerTarget || e).some(function (e) {
                return st(e, s);
              })
            ) {
              if (it.isTouch) return;
              if (y.state.isVisible && y.props.trigger.indexOf("click") >= 0)
                return;
            } else W("onClickOutside", [y, t]);
            !0 === y.props.hideOnClick &&
              (y.clearDelayTimeouts(),
              y.hide(),
              (p = !0),
              setTimeout(function () {
                p = !1;
              }),
              y.state.isMounted || z());
          }
        }
      }
      function q() {
        h = !0;
      }
      function H() {
        h = !1;
      }
      function V() {
        var e = T();
        e.addEventListener("mousedown", j, !0),
          e.addEventListener("touchend", j, Pe),
          e.addEventListener("touchstart", H, Pe),
          e.addEventListener("touchmove", q, Pe);
      }
      function z() {
        var e = T();
        e.removeEventListener("mousedown", j, !0),
          e.removeEventListener("touchend", j, Pe),
          e.removeEventListener("touchstart", H, Pe),
          e.removeEventListener("touchmove", q, Pe);
      }
      function B(e, t) {
        var s = _().box;
        function i(e) {
          e.target === s && (tt(s, "remove", i), t());
        }
        if (0 === e) return t();
        tt(s, "remove", r), tt(s, "add", i), (r = i);
      }
      function R(t, s, i) {
        void 0 === i && (i = !1),
          Be(y.props.triggerTarget || e).forEach(function (e) {
            e.addEventListener(t, s, i),
              m.push({ node: e, eventType: t, handler: s, options: i });
          });
      }
      function I() {
        var e;
        C() &&
          (R("touchstart", Y, { passive: !0 }),
          R("touchend", U, { passive: !0 })),
          ((e = y.props.trigger), e.split(/\s+/).filter(Boolean)).forEach(
            function (e) {
              if ("manual" !== e)
                switch ((R(e, Y), e)) {
                  case "mouseenter":
                    R("mouseleave", U);
                    break;
                  case "focus":
                    R(lt ? "focusout" : "blur", Z);
                    break;
                  case "focusin":
                    R("focusout", Z);
                }
            },
          );
      }
      function F() {
        m.forEach(function (e) {
          var t = e.node,
            s = e.eventType,
            i = e.handler,
            n = e.options;
          t.removeEventListener(s, i, n);
        }),
          (m = []);
      }
      function Y(e) {
        var t,
          s = !1;
        if (y.state.isEnabled && !Q(e) && !p) {
          var i = "focus" === (null == (t = o) ? void 0 : t.type);
          (o = e),
            (l = e.currentTarget),
            $(),
            !y.state.isVisible &&
              Ze(e) &&
              Et.forEach(function (t) {
                return t(e);
              }),
            "click" === e.type &&
            (y.props.trigger.indexOf("mouseenter") < 0 || d) &&
            !1 !== y.props.hideOnClick &&
            y.state.isVisible
              ? (s = !0)
              : ee(e),
            "click" === e.type && (d = !s),
            s && !i && te(e);
        }
      }
      function X(e) {
        var t = e.target,
          s = k().contains(t) || E.contains(t);
        if ("mousemove" !== e.type || !s) {
          var i = K()
            .concat(E)
            .map(function (e) {
              var t,
                s = null == (t = e._tippy.popperInstance) ? void 0 : t.state;
              return s
                ? {
                    popperRect: e.getBoundingClientRect(),
                    popperState: s,
                    props: u,
                  }
                : null;
            })
            .filter(Boolean);
          (function (e, t) {
            var s = t.clientX,
              i = t.clientY;
            return e.every(function (e) {
              var t = e.popperRect,
                n = e.popperState,
                o = e.props.interactiveBorder,
                r = Ie(n.placement),
                a = n.modifiersData.offset;
              if (!a) return !0;
              var l = "bottom" === r ? a.top.y : 0,
                c = "top" === r ? a.bottom.y : 0,
                u = "right" === r ? a.left.x : 0,
                d = "left" === r ? a.right.x : 0,
                p = t.top - i + l > o,
                h = i - t.bottom - c > o,
                f = t.left - s + u > o,
                m = s - t.right - d > o;
              return p || h || f || m;
            });
          })(i, e) && (P(), te(e));
        }
      }
      function U(e) {
        Q(e) ||
          (y.props.trigger.indexOf("click") >= 0 && d) ||
          (y.props.interactive ? y.hideWithInteractivity(e) : te(e));
      }
      function Z(e) {
        (y.props.trigger.indexOf("focusin") < 0 && e.target !== k()) ||
          (y.props.interactive &&
            e.relatedTarget &&
            E.contains(e.relatedTarget)) ||
          te(e);
      }
      function Q(e) {
        return !!it.isTouch && C() !== e.type.indexOf("touch") >= 0;
      }
      function G() {
        J();
        var t = y.props,
          s = t.popperOptions,
          i = t.placement,
          n = t.offset,
          o = t.getReferenceClientRect,
          r = t.moveTransition,
          l = L() ? bt(E).arrow : null,
          c = o
            ? {
                getBoundingClientRect: o,
                contextElement: o.contextElement || k(),
              }
            : e,
          u = {
            name: "$$tippy",
            enabled: !0,
            phase: "beforeWrite",
            requires: ["computeStyles"],
            fn: function (e) {
              var t = e.state;
              if (L()) {
                var s = _().box;
                ["placement", "reference-hidden", "escaped"].forEach(
                  function (e) {
                    "placement" === e
                      ? s.setAttribute("data-placement", t.placement)
                      : t.attributes.popper["data-popper-" + e]
                      ? s.setAttribute("data-" + e, "")
                      : s.removeAttribute("data-" + e);
                  },
                ),
                  (t.attributes.popper = {});
              }
            },
          },
          d = [
            { name: "offset", options: { offset: n } },
            {
              name: "preventOverflow",
              options: { padding: { top: 2, bottom: 2, left: 5, right: 5 } },
            },
            { name: "flip", options: { padding: 5 } },
            { name: "computeStyles", options: { adaptive: !r } },
            u,
          ];
        L() &&
          l &&
          d.push({ name: "arrow", options: { element: l, padding: 3 } }),
          d.push.apply(d, (null == s ? void 0 : s.modifiers) || []),
          (y.popperInstance = Me(
            c,
            E,
            Object.assign({}, s, {
              placement: i,
              onFirstUpdate: a,
              modifiers: d,
            }),
          ));
      }
      function J() {
        y.popperInstance &&
          (y.popperInstance.destroy(), (y.popperInstance = null));
      }
      function K() {
        return Fe(E.querySelectorAll("[data-tippy-root]"));
      }
      function ee(e) {
        y.clearDelayTimeouts(), e && W("onTrigger", [y, e]), V();
        var t = M(!0),
          i = A(),
          n = i[0],
          o = i[1];
        it.isTouch && "hold" === n && o && (t = o),
          t
            ? (s = setTimeout(function () {
                y.show();
              }, t))
            : y.show();
      }
      function te(e) {
        if (
          (y.clearDelayTimeouts(), W("onUntrigger", [y, e]), y.state.isVisible)
        ) {
          if (
            !(
              y.props.trigger.indexOf("mouseenter") >= 0 &&
              y.props.trigger.indexOf("click") >= 0 &&
              ["mouseleave", "mousemove"].indexOf(e.type) >= 0 &&
              d
            )
          ) {
            var t = M(!1);
            t
              ? (i = setTimeout(function () {
                  y.state.isVisible && y.hide();
                }, t))
              : (n = requestAnimationFrame(function () {
                  y.hide();
                }));
          }
        } else z();
      }
    }
    function Ot(e, t) {
      void 0 === t && (t = {});
      var s = ut.plugins.concat(t.plugins || []);
      document.addEventListener("touchstart", ot, Pe),
        window.addEventListener("blur", at);
      var i = Object.assign({}, t, { plugins: s }),
        n = Ge(e).reduce(function (e, t) {
          var s = t && St(t, i);
          return s && e.push(s), e;
        }, []);
      return Ue(e) ? n[0] : n;
    }
    (Ot.defaultProps = ut),
      (Ot.setDefaultProps = function (e) {
        Object.keys(e).forEach(function (t) {
          ut[t] = e[t];
        });
      }),
      (Ot.currentInput = it);
    Object.assign({}, pe, {
      effect: function (e) {
        var t = e.state,
          s = {
            popper: {
              position: t.options.strategy,
              left: "0",
              top: "0",
              margin: "0",
            },
            arrow: { position: "absolute" },
            reference: {},
          };
        Object.assign(t.elements.popper.style, s.popper),
          (t.styles = s),
          t.elements.arrow && Object.assign(t.elements.arrow.style, s.arrow);
      },
    });
    Ot.setDefaultProps({ render: yt });
    Ot("[data-tippy-content]", {});
    var At = s(807);
    const Ct = function (e) {
      var t = typeof e;
      return null != e && ("object" == t || "function" == t);
    };
    const Lt =
      "object" == typeof global && global && global.Object === Object && global;
    var kt = "object" == typeof self && self && self.Object === Object && self;
    const Tt = Lt || kt || Function("return this")();
    const _t = function () {
      return Tt.Date.now();
    };
    var Mt = /\s/;
    const Dt = function (e) {
      for (var t = e.length; t-- && Mt.test(e.charAt(t)); );
      return t;
    };
    var Wt = /^\s+/;
    const Nt = function (e) {
      return e ? e.slice(0, Dt(e) + 1).replace(Wt, "") : e;
    };
    const $t = Tt.Symbol;
    var Pt = Object.prototype,
      jt = Pt.hasOwnProperty,
      qt = Pt.toString,
      Ht = $t ? $t.toStringTag : void 0;
    const Vt = function (e) {
      var t = jt.call(e, Ht),
        s = e[Ht];
      try {
        e[Ht] = void 0;
        var i = !0;
      } catch (e) {}
      var n = qt.call(e);
      return i && (t ? (e[Ht] = s) : delete e[Ht]), n;
    };
    var zt = Object.prototype.toString;
    const Bt = function (e) {
      return zt.call(e);
    };
    var Rt = $t ? $t.toStringTag : void 0;
    const It = function (e) {
      return null == e
        ? void 0 === e
          ? "[object Undefined]"
          : "[object Null]"
        : Rt && Rt in Object(e)
        ? Vt(e)
        : Bt(e);
    };
    const Ft = function (e) {
      return null != e && "object" == typeof e;
    };
    const Yt = function (e) {
      return "symbol" == typeof e || (Ft(e) && "[object Symbol]" == It(e));
    };
    var Xt = /^[-+]0x[0-9a-f]+$/i,
      Ut = /^0b[01]+$/i,
      Zt = /^0o[0-7]+$/i,
      Qt = parseInt;
    const Gt = function (e) {
      if ("number" == typeof e) return e;
      if (Yt(e)) return NaN;
      if (Ct(e)) {
        var t = "function" == typeof e.valueOf ? e.valueOf() : e;
        e = Ct(t) ? t + "" : t;
      }
      if ("string" != typeof e) return 0 === e ? e : +e;
      e = Nt(e);
      var s = Ut.test(e);
      return s || Zt.test(e)
        ? Qt(e.slice(2), s ? 2 : 8)
        : Xt.test(e)
        ? NaN
        : +e;
    };
    var Jt = Math.max,
      Kt = Math.min;
    const es = function (e, t, s) {
      var i,
        n,
        o,
        r,
        a,
        l,
        c = 0,
        u = !1,
        d = !1,
        p = !0;
      if ("function" != typeof e) throw new TypeError("Expected a function");
      function h(t) {
        var s = i,
          o = n;
        return (i = n = void 0), (c = t), (r = e.apply(o, s));
      }
      function f(e) {
        var s = e - l;
        return void 0 === l || s >= t || s < 0 || (d && e - c >= o);
      }
      function m() {
        var e = _t();
        if (f(e)) return v(e);
        a = setTimeout(
          m,
          (function (e) {
            var s = t - (e - l);
            return d ? Kt(s, o - (e - c)) : s;
          })(e),
        );
      }
      function v(e) {
        return (a = void 0), p && i ? h(e) : ((i = n = void 0), r);
      }
      function g() {
        var e = _t(),
          s = f(e);
        if (((i = arguments), (n = this), (l = e), s)) {
          if (void 0 === a)
            return (function (e) {
              return (c = e), (a = setTimeout(m, t)), u ? h(e) : r;
            })(l);
          if (d) return clearTimeout(a), (a = setTimeout(m, t)), h(l);
        }
        return void 0 === a && (a = setTimeout(m, t)), r;
      }
      return (
        (t = Gt(t) || 0),
        Ct(s) &&
          ((u = !!s.leading),
          (o = (d = "maxWait" in s) ? Jt(Gt(s.maxWait) || 0, t) : o),
          (p = "trailing" in s ? !!s.trailing : p)),
        (g.cancel = function () {
          void 0 !== a && clearTimeout(a), (c = 0), (i = l = n = a = void 0);
        }),
        (g.flush = function () {
          return void 0 === a ? r : v(_t());
        }),
        g
      );
    };
    const ts = function (e, t, s) {
      var i = !0,
        n = !0;
      if ("function" != typeof e) throw new TypeError("Expected a function");
      return (
        Ct(s) &&
          ((i = "leading" in s ? !!s.leading : i),
          (n = "trailing" in s ? !!s.trailing : n)),
        es(e, t, { leading: i, maxWait: t, trailing: n })
      );
    };
    var ss = function () {
        return (
          (ss =
            Object.assign ||
            function (e) {
              for (var t, s = 1, i = arguments.length; s < i; s++)
                for (var n in (t = arguments[s]))
                  Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
              return e;
            }),
          ss.apply(this, arguments)
        );
      },
      is = null,
      ns = null;
    function os() {
      if (null === is) {
        if ("undefined" == typeof document) return (is = 0);
        var e = document.body,
          t = document.createElement("div");
        t.classList.add("simplebar-hide-scrollbar"), e.appendChild(t);
        var s = t.getBoundingClientRect().right;
        e.removeChild(t), (is = s);
      }
      return is;
    }
    function rs(e) {
      return e && e.ownerDocument && e.ownerDocument.defaultView
        ? e.ownerDocument.defaultView
        : window;
    }
    function as(e) {
      return e && e.ownerDocument ? e.ownerDocument : document;
    }
    At &&
      window.addEventListener("resize", function () {
        ns !== window.devicePixelRatio &&
          ((ns = window.devicePixelRatio), (is = null));
      });
    var ls = function (e) {
      return Array.prototype.reduce.call(
        e,
        function (e, t) {
          var s = t.name.match(/data-simplebar-(.+)/);
          if (s) {
            var i = s[1].replace(/\W+(.)/g, function (e, t) {
              return t.toUpperCase();
            });
            switch (t.value) {
              case "true":
                e[i] = !0;
                break;
              case "false":
                e[i] = !1;
                break;
              case void 0:
                e[i] = !0;
                break;
              default:
                e[i] = t.value;
            }
          }
          return e;
        },
        {},
      );
    };
    function cs(e, t) {
      var s;
      e && (s = e.classList).add.apply(s, t.split(" "));
    }
    function us(e, t) {
      e &&
        t.split(" ").forEach(function (t) {
          e.classList.remove(t);
        });
    }
    function ds(e) {
      return ".".concat(e.split(" ").join("."));
    }
    var ps = Object.freeze({
        __proto__: null,
        getElementWindow: rs,
        getElementDocument: as,
        getOptions: ls,
        addClasses: cs,
        removeClasses: us,
        classNamesToQuery: ds,
      }),
      hs = rs,
      fs = as,
      ms = ls,
      vs = cs,
      gs = us,
      bs = ds,
      ys = (function () {
        function e(t, s) {
          void 0 === s && (s = {});
          var i = this;
          if (
            ((this.removePreventClickId = null),
            (this.minScrollbarWidth = 20),
            (this.stopScrollDelay = 175),
            (this.isScrolling = !1),
            (this.isMouseEntering = !1),
            (this.scrollXTicking = !1),
            (this.scrollYTicking = !1),
            (this.wrapperEl = null),
            (this.contentWrapperEl = null),
            (this.contentEl = null),
            (this.offsetEl = null),
            (this.maskEl = null),
            (this.placeholderEl = null),
            (this.heightAutoObserverWrapperEl = null),
            (this.heightAutoObserverEl = null),
            (this.rtlHelpers = null),
            (this.scrollbarWidth = 0),
            (this.resizeObserver = null),
            (this.mutationObserver = null),
            (this.elStyles = null),
            (this.isRtl = null),
            (this.mouseX = 0),
            (this.mouseY = 0),
            (this.onMouseMove = function () {}),
            (this.onWindowResize = function () {}),
            (this.onStopScrolling = function () {}),
            (this.onMouseEntered = function () {}),
            (this.onScroll = function () {
              var e = hs(i.el);
              i.scrollXTicking ||
                (e.requestAnimationFrame(i.scrollX), (i.scrollXTicking = !0)),
                i.scrollYTicking ||
                  (e.requestAnimationFrame(i.scrollY), (i.scrollYTicking = !0)),
                i.isScrolling ||
                  ((i.isScrolling = !0), vs(i.el, i.classNames.scrolling)),
                i.showScrollbar("x"),
                i.showScrollbar("y"),
                i.onStopScrolling();
            }),
            (this.scrollX = function () {
              i.axis.x.isOverflowing && i.positionScrollbar("x"),
                (i.scrollXTicking = !1);
            }),
            (this.scrollY = function () {
              i.axis.y.isOverflowing && i.positionScrollbar("y"),
                (i.scrollYTicking = !1);
            }),
            (this._onStopScrolling = function () {
              gs(i.el, i.classNames.scrolling),
                i.options.autoHide &&
                  (i.hideScrollbar("x"), i.hideScrollbar("y")),
                (i.isScrolling = !1);
            }),
            (this.onMouseEnter = function () {
              i.isMouseEntering ||
                (vs(i.el, i.classNames.mouseEntered),
                i.showScrollbar("x"),
                i.showScrollbar("y"),
                (i.isMouseEntering = !0)),
                i.onMouseEntered();
            }),
            (this._onMouseEntered = function () {
              gs(i.el, i.classNames.mouseEntered),
                i.options.autoHide &&
                  (i.hideScrollbar("x"), i.hideScrollbar("y")),
                (i.isMouseEntering = !1);
            }),
            (this._onMouseMove = function (e) {
              (i.mouseX = e.clientX),
                (i.mouseY = e.clientY),
                (i.axis.x.isOverflowing || i.axis.x.forceVisible) &&
                  i.onMouseMoveForAxis("x"),
                (i.axis.y.isOverflowing || i.axis.y.forceVisible) &&
                  i.onMouseMoveForAxis("y");
            }),
            (this.onMouseLeave = function () {
              i.onMouseMove.cancel(),
                (i.axis.x.isOverflowing || i.axis.x.forceVisible) &&
                  i.onMouseLeaveForAxis("x"),
                (i.axis.y.isOverflowing || i.axis.y.forceVisible) &&
                  i.onMouseLeaveForAxis("y"),
                (i.mouseX = -1),
                (i.mouseY = -1);
            }),
            (this._onWindowResize = function () {
              (i.scrollbarWidth = i.getScrollbarWidth()),
                i.hideNativeScrollbar();
            }),
            (this.onPointerEvent = function (e) {
              var t, s;
              i.axis.x.track.el &&
                i.axis.y.track.el &&
                i.axis.x.scrollbar.el &&
                i.axis.y.scrollbar.el &&
                ((i.axis.x.track.rect =
                  i.axis.x.track.el.getBoundingClientRect()),
                (i.axis.y.track.rect =
                  i.axis.y.track.el.getBoundingClientRect()),
                (i.axis.x.isOverflowing || i.axis.x.forceVisible) &&
                  (t = i.isWithinBounds(i.axis.x.track.rect)),
                (i.axis.y.isOverflowing || i.axis.y.forceVisible) &&
                  (s = i.isWithinBounds(i.axis.y.track.rect)),
                (t || s) &&
                  (e.stopPropagation(),
                  "pointerdown" === e.type &&
                    "touch" !== e.pointerType &&
                    (t &&
                      ((i.axis.x.scrollbar.rect =
                        i.axis.x.scrollbar.el.getBoundingClientRect()),
                      i.isWithinBounds(i.axis.x.scrollbar.rect)
                        ? i.onDragStart(e, "x")
                        : i.onTrackClick(e, "x")),
                    s &&
                      ((i.axis.y.scrollbar.rect =
                        i.axis.y.scrollbar.el.getBoundingClientRect()),
                      i.isWithinBounds(i.axis.y.scrollbar.rect)
                        ? i.onDragStart(e, "y")
                        : i.onTrackClick(e, "y")))));
            }),
            (this.drag = function (t) {
              var s, n, o, r, a, l, c, u, d, p, h;
              if (i.draggedAxis && i.contentWrapperEl) {
                var f = i.axis[i.draggedAxis].track,
                  m =
                    null !==
                      (n =
                        null === (s = f.rect) || void 0 === s
                          ? void 0
                          : s[i.axis[i.draggedAxis].sizeAttr]) && void 0 !== n
                      ? n
                      : 0,
                  v = i.axis[i.draggedAxis].scrollbar,
                  g =
                    null !==
                      (r =
                        null === (o = i.contentWrapperEl) || void 0 === o
                          ? void 0
                          : o[i.axis[i.draggedAxis].scrollSizeAttr]) &&
                    void 0 !== r
                      ? r
                      : 0,
                  b = parseInt(
                    null !==
                      (l =
                        null === (a = i.elStyles) || void 0 === a
                          ? void 0
                          : a[i.axis[i.draggedAxis].sizeAttr]) && void 0 !== l
                      ? l
                      : "0px",
                    10,
                  );
                t.preventDefault(), t.stopPropagation();
                var y =
                    ("y" === i.draggedAxis ? t.pageY : t.pageX) -
                    (null !==
                      (u =
                        null === (c = f.rect) || void 0 === c
                          ? void 0
                          : c[i.axis[i.draggedAxis].offsetAttr]) && void 0 !== u
                      ? u
                      : 0) -
                    i.axis[i.draggedAxis].dragOffset,
                  x =
                    ((y =
                      "x" === i.draggedAxis && i.isRtl
                        ? (null !==
                            (p =
                              null === (d = f.rect) || void 0 === d
                                ? void 0
                                : d[i.axis[i.draggedAxis].sizeAttr]) &&
                          void 0 !== p
                            ? p
                            : 0) -
                          v.size -
                          y
                        : y) /
                      (m - v.size)) *
                    (g - b);
                "x" === i.draggedAxis &&
                  i.isRtl &&
                  (x = (
                    null === (h = e.getRtlHelpers()) || void 0 === h
                      ? void 0
                      : h.isScrollingToNegative
                  )
                    ? -x
                    : x),
                  (i.contentWrapperEl[i.axis[i.draggedAxis].scrollOffsetAttr] =
                    x);
              }
            }),
            (this.onEndDrag = function (e) {
              var t = fs(i.el),
                s = hs(i.el);
              e.preventDefault(),
                e.stopPropagation(),
                gs(i.el, i.classNames.dragging),
                t.removeEventListener("mousemove", i.drag, !0),
                t.removeEventListener("mouseup", i.onEndDrag, !0),
                (i.removePreventClickId = s.setTimeout(function () {
                  t.removeEventListener("click", i.preventClick, !0),
                    t.removeEventListener("dblclick", i.preventClick, !0),
                    (i.removePreventClickId = null);
                }));
            }),
            (this.preventClick = function (e) {
              e.preventDefault(), e.stopPropagation();
            }),
            (this.el = t),
            (this.options = ss(ss({}, e.defaultOptions), s)),
            (this.classNames = ss(
              ss({}, e.defaultOptions.classNames),
              s.classNames,
            )),
            (this.axis = {
              x: {
                scrollOffsetAttr: "scrollLeft",
                sizeAttr: "width",
                scrollSizeAttr: "scrollWidth",
                offsetSizeAttr: "offsetWidth",
                offsetAttr: "left",
                overflowAttr: "overflowX",
                dragOffset: 0,
                isOverflowing: !0,
                forceVisible: !1,
                track: { size: null, el: null, rect: null, isVisible: !1 },
                scrollbar: { size: null, el: null, rect: null, isVisible: !1 },
              },
              y: {
                scrollOffsetAttr: "scrollTop",
                sizeAttr: "height",
                scrollSizeAttr: "scrollHeight",
                offsetSizeAttr: "offsetHeight",
                offsetAttr: "top",
                overflowAttr: "overflowY",
                dragOffset: 0,
                isOverflowing: !0,
                forceVisible: !1,
                track: { size: null, el: null, rect: null, isVisible: !1 },
                scrollbar: { size: null, el: null, rect: null, isVisible: !1 },
              },
            }),
            "object" != typeof this.el || !this.el.nodeName)
          )
            throw new Error(
              "Argument passed to SimpleBar must be an HTML element instead of ".concat(
                this.el,
              ),
            );
          (this.onMouseMove = ts(this._onMouseMove, 64)),
            (this.onWindowResize = es(this._onWindowResize, 64, {
              leading: !0,
            })),
            (this.onStopScrolling = es(
              this._onStopScrolling,
              this.stopScrollDelay,
            )),
            (this.onMouseEntered = es(
              this._onMouseEntered,
              this.stopScrollDelay,
            )),
            this.init();
        }
        return (
          (e.getRtlHelpers = function () {
            if (e.rtlHelpers) return e.rtlHelpers;
            var t = document.createElement("div");
            t.innerHTML =
              '<div class="simplebar-dummy-scrollbar-size"><div></div></div>';
            var s = t.firstElementChild,
              i = null == s ? void 0 : s.firstElementChild;
            if (!i) return null;
            document.body.appendChild(s), (s.scrollLeft = 0);
            var n = e.getOffset(s),
              o = e.getOffset(i);
            s.scrollLeft = -999;
            var r = e.getOffset(i);
            return (
              document.body.removeChild(s),
              (e.rtlHelpers = {
                isScrollOriginAtZero: n.left !== o.left,
                isScrollingToNegative: o.left !== r.left,
              }),
              e.rtlHelpers
            );
          }),
          (e.prototype.getScrollbarWidth = function () {
            try {
              return (this.contentWrapperEl &&
                "none" ===
                  getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar")
                    .display) ||
                "scrollbarWidth" in document.documentElement.style ||
                "-ms-overflow-style" in document.documentElement.style
                ? 0
                : os();
            } catch (e) {
              return os();
            }
          }),
          (e.getOffset = function (e) {
            var t = e.getBoundingClientRect(),
              s = fs(e),
              i = hs(e);
            return {
              top: t.top + (i.pageYOffset || s.documentElement.scrollTop),
              left: t.left + (i.pageXOffset || s.documentElement.scrollLeft),
            };
          }),
          (e.prototype.init = function () {
            At &&
              (this.initDOM(),
              (this.rtlHelpers = e.getRtlHelpers()),
              (this.scrollbarWidth = this.getScrollbarWidth()),
              this.recalculate(),
              this.initListeners());
          }),
          (e.prototype.initDOM = function () {
            var e, t;
            (this.wrapperEl = this.el.querySelector(
              bs(this.classNames.wrapper),
            )),
              (this.contentWrapperEl =
                this.options.scrollableNode ||
                this.el.querySelector(bs(this.classNames.contentWrapper))),
              (this.contentEl =
                this.options.contentNode ||
                this.el.querySelector(bs(this.classNames.contentEl))),
              (this.offsetEl = this.el.querySelector(
                bs(this.classNames.offset),
              )),
              (this.maskEl = this.el.querySelector(bs(this.classNames.mask))),
              (this.placeholderEl = this.findChild(
                this.wrapperEl,
                bs(this.classNames.placeholder),
              )),
              (this.heightAutoObserverWrapperEl = this.el.querySelector(
                bs(this.classNames.heightAutoObserverWrapperEl),
              )),
              (this.heightAutoObserverEl = this.el.querySelector(
                bs(this.classNames.heightAutoObserverEl),
              )),
              (this.axis.x.track.el = this.findChild(
                this.el,
                ""
                  .concat(bs(this.classNames.track))
                  .concat(bs(this.classNames.horizontal)),
              )),
              (this.axis.y.track.el = this.findChild(
                this.el,
                ""
                  .concat(bs(this.classNames.track))
                  .concat(bs(this.classNames.vertical)),
              )),
              (this.axis.x.scrollbar.el =
                (null === (e = this.axis.x.track.el) || void 0 === e
                  ? void 0
                  : e.querySelector(bs(this.classNames.scrollbar))) || null),
              (this.axis.y.scrollbar.el =
                (null === (t = this.axis.y.track.el) || void 0 === t
                  ? void 0
                  : t.querySelector(bs(this.classNames.scrollbar))) || null),
              this.options.autoHide ||
                (vs(this.axis.x.scrollbar.el, this.classNames.visible),
                vs(this.axis.y.scrollbar.el, this.classNames.visible));
          }),
          (e.prototype.initListeners = function () {
            var e,
              t = this,
              s = hs(this.el);
            if (
              (this.el.addEventListener("mouseenter", this.onMouseEnter),
              this.el.addEventListener("pointerdown", this.onPointerEvent, !0),
              this.el.addEventListener("mousemove", this.onMouseMove),
              this.el.addEventListener("mouseleave", this.onMouseLeave),
              null === (e = this.contentWrapperEl) ||
                void 0 === e ||
                e.addEventListener("scroll", this.onScroll),
              s.addEventListener("resize", this.onWindowResize),
              this.contentEl)
            ) {
              if (window.ResizeObserver) {
                var i = !1,
                  n = s.ResizeObserver || ResizeObserver;
                (this.resizeObserver = new n(function () {
                  i &&
                    s.requestAnimationFrame(function () {
                      t.recalculate();
                    });
                })),
                  this.resizeObserver.observe(this.el),
                  this.resizeObserver.observe(this.contentEl),
                  s.requestAnimationFrame(function () {
                    i = !0;
                  });
              }
              (this.mutationObserver = new s.MutationObserver(function () {
                s.requestAnimationFrame(function () {
                  t.recalculate();
                });
              })),
                this.mutationObserver.observe(this.contentEl, {
                  childList: !0,
                  subtree: !0,
                  characterData: !0,
                });
            }
          }),
          (e.prototype.recalculate = function () {
            if (
              this.heightAutoObserverEl &&
              this.contentEl &&
              this.contentWrapperEl &&
              this.wrapperEl &&
              this.placeholderEl
            ) {
              var e = hs(this.el);
              (this.elStyles = e.getComputedStyle(this.el)),
                (this.isRtl = "rtl" === this.elStyles.direction);
              var t = this.contentEl.offsetWidth,
                s = this.heightAutoObserverEl.offsetHeight <= 1,
                i = this.heightAutoObserverEl.offsetWidth <= 1 || t > 0,
                n = this.contentWrapperEl.offsetWidth,
                o = this.elStyles.overflowX,
                r = this.elStyles.overflowY;
              (this.contentEl.style.padding = ""
                .concat(this.elStyles.paddingTop, " ")
                .concat(this.elStyles.paddingRight, " ")
                .concat(this.elStyles.paddingBottom, " ")
                .concat(this.elStyles.paddingLeft)),
                (this.wrapperEl.style.margin = "-"
                  .concat(this.elStyles.paddingTop, " -")
                  .concat(this.elStyles.paddingRight, " -")
                  .concat(this.elStyles.paddingBottom, " -")
                  .concat(this.elStyles.paddingLeft));
              var a = this.contentEl.scrollHeight,
                l = this.contentEl.scrollWidth;
              (this.contentWrapperEl.style.height = s ? "auto" : "100%"),
                (this.placeholderEl.style.width = i
                  ? "".concat(t || l, "px")
                  : "auto"),
                (this.placeholderEl.style.height = "".concat(a, "px"));
              var c = this.contentWrapperEl.offsetHeight;
              (this.axis.x.isOverflowing = 0 !== t && l > t),
                (this.axis.y.isOverflowing = a > c),
                (this.axis.x.isOverflowing =
                  "hidden" !== o && this.axis.x.isOverflowing),
                (this.axis.y.isOverflowing =
                  "hidden" !== r && this.axis.y.isOverflowing),
                (this.axis.x.forceVisible =
                  "x" === this.options.forceVisible ||
                  !0 === this.options.forceVisible),
                (this.axis.y.forceVisible =
                  "y" === this.options.forceVisible ||
                  !0 === this.options.forceVisible),
                this.hideNativeScrollbar();
              var u = this.axis.x.isOverflowing ? this.scrollbarWidth : 0,
                d = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
              (this.axis.x.isOverflowing =
                this.axis.x.isOverflowing && l > n - d),
                (this.axis.y.isOverflowing =
                  this.axis.y.isOverflowing && a > c - u),
                (this.axis.x.scrollbar.size = this.getScrollbarSize("x")),
                (this.axis.y.scrollbar.size = this.getScrollbarSize("y")),
                this.axis.x.scrollbar.el &&
                  (this.axis.x.scrollbar.el.style.width = "".concat(
                    this.axis.x.scrollbar.size,
                    "px",
                  )),
                this.axis.y.scrollbar.el &&
                  (this.axis.y.scrollbar.el.style.height = "".concat(
                    this.axis.y.scrollbar.size,
                    "px",
                  )),
                this.positionScrollbar("x"),
                this.positionScrollbar("y"),
                this.toggleTrackVisibility("x"),
                this.toggleTrackVisibility("y");
            }
          }),
          (e.prototype.getScrollbarSize = function (e) {
            var t, s;
            if (
              (void 0 === e && (e = "y"),
              !this.axis[e].isOverflowing || !this.contentEl)
            )
              return 0;
            var i,
              n = this.contentEl[this.axis[e].scrollSizeAttr],
              o =
                null !==
                  (s =
                    null === (t = this.axis[e].track.el) || void 0 === t
                      ? void 0
                      : t[this.axis[e].offsetSizeAttr]) && void 0 !== s
                  ? s
                  : 0,
              r = o / n;
            return (
              (i = Math.max(~~(r * o), this.options.scrollbarMinSize)),
              this.options.scrollbarMaxSize &&
                (i = Math.min(i, this.options.scrollbarMaxSize)),
              i
            );
          }),
          (e.prototype.positionScrollbar = function (t) {
            var s, i, n;
            void 0 === t && (t = "y");
            var o = this.axis[t].scrollbar;
            if (
              this.axis[t].isOverflowing &&
              this.contentWrapperEl &&
              o.el &&
              this.elStyles
            ) {
              var r = this.contentWrapperEl[this.axis[t].scrollSizeAttr],
                a =
                  (null === (s = this.axis[t].track.el) || void 0 === s
                    ? void 0
                    : s[this.axis[t].offsetSizeAttr]) || 0,
                l = parseInt(this.elStyles[this.axis[t].sizeAttr], 10),
                c = this.contentWrapperEl[this.axis[t].scrollOffsetAttr];
              (c =
                "x" === t &&
                this.isRtl &&
                (null === (i = e.getRtlHelpers()) || void 0 === i
                  ? void 0
                  : i.isScrollOriginAtZero)
                  ? -c
                  : c),
                "x" === t &&
                  this.isRtl &&
                  (c = (
                    null === (n = e.getRtlHelpers()) || void 0 === n
                      ? void 0
                      : n.isScrollingToNegative
                  )
                    ? c
                    : -c);
              var u = c / (r - l),
                d = ~~((a - o.size) * u);
              (d = "x" === t && this.isRtl ? -d + (a - o.size) : d),
                (o.el.style.transform =
                  "x" === t
                    ? "translate3d(".concat(d, "px, 0, 0)")
                    : "translate3d(0, ".concat(d, "px, 0)"));
            }
          }),
          (e.prototype.toggleTrackVisibility = function (e) {
            void 0 === e && (e = "y");
            var t = this.axis[e].track.el,
              s = this.axis[e].scrollbar.el;
            t &&
              s &&
              this.contentWrapperEl &&
              (this.axis[e].isOverflowing || this.axis[e].forceVisible
                ? ((t.style.visibility = "visible"),
                  (this.contentWrapperEl.style[this.axis[e].overflowAttr] =
                    "scroll"),
                  this.el.classList.add(
                    "".concat(this.classNames.scrollable, "-").concat(e),
                  ))
                : ((t.style.visibility = "hidden"),
                  (this.contentWrapperEl.style[this.axis[e].overflowAttr] =
                    "hidden"),
                  this.el.classList.remove(
                    "".concat(this.classNames.scrollable, "-").concat(e),
                  )),
              this.axis[e].isOverflowing
                ? (s.style.display = "block")
                : (s.style.display = "none"));
          }),
          (e.prototype.showScrollbar = function (e) {
            void 0 === e && (e = "y"),
              this.axis[e].isOverflowing &&
                !this.axis[e].scrollbar.isVisible &&
                (vs(this.axis[e].scrollbar.el, this.classNames.visible),
                (this.axis[e].scrollbar.isVisible = !0));
          }),
          (e.prototype.hideScrollbar = function (e) {
            void 0 === e && (e = "y"),
              this.axis[e].isOverflowing &&
                this.axis[e].scrollbar.isVisible &&
                (gs(this.axis[e].scrollbar.el, this.classNames.visible),
                (this.axis[e].scrollbar.isVisible = !1));
          }),
          (e.prototype.hideNativeScrollbar = function () {
            this.offsetEl &&
              ((this.offsetEl.style[this.isRtl ? "left" : "right"] =
                this.axis.y.isOverflowing || this.axis.y.forceVisible
                  ? "-".concat(this.scrollbarWidth, "px")
                  : "0px"),
              (this.offsetEl.style.bottom =
                this.axis.x.isOverflowing || this.axis.x.forceVisible
                  ? "-".concat(this.scrollbarWidth, "px")
                  : "0px"));
          }),
          (e.prototype.onMouseMoveForAxis = function (e) {
            void 0 === e && (e = "y");
            var t = this.axis[e];
            t.track.el &&
              t.scrollbar.el &&
              ((t.track.rect = t.track.el.getBoundingClientRect()),
              (t.scrollbar.rect = t.scrollbar.el.getBoundingClientRect()),
              this.isWithinBounds(t.track.rect)
                ? (this.showScrollbar(e),
                  vs(t.track.el, this.classNames.hover),
                  this.isWithinBounds(t.scrollbar.rect)
                    ? vs(t.scrollbar.el, this.classNames.hover)
                    : gs(t.scrollbar.el, this.classNames.hover))
                : (gs(t.track.el, this.classNames.hover),
                  this.options.autoHide && this.hideScrollbar(e)));
          }),
          (e.prototype.onMouseLeaveForAxis = function (e) {
            void 0 === e && (e = "y"),
              gs(this.axis[e].track.el, this.classNames.hover),
              gs(this.axis[e].scrollbar.el, this.classNames.hover),
              this.options.autoHide && this.hideScrollbar(e);
          }),
          (e.prototype.onDragStart = function (e, t) {
            var s;
            void 0 === t && (t = "y");
            var i = fs(this.el),
              n = hs(this.el),
              o = this.axis[t].scrollbar,
              r = "y" === t ? e.pageY : e.pageX;
            (this.axis[t].dragOffset =
              r -
              ((null === (s = o.rect) || void 0 === s
                ? void 0
                : s[this.axis[t].offsetAttr]) || 0)),
              (this.draggedAxis = t),
              vs(this.el, this.classNames.dragging),
              i.addEventListener("mousemove", this.drag, !0),
              i.addEventListener("mouseup", this.onEndDrag, !0),
              null === this.removePreventClickId
                ? (i.addEventListener("click", this.preventClick, !0),
                  i.addEventListener("dblclick", this.preventClick, !0))
                : (n.clearTimeout(this.removePreventClickId),
                  (this.removePreventClickId = null));
          }),
          (e.prototype.onTrackClick = function (e, t) {
            var s,
              i,
              n,
              o,
              r = this;
            void 0 === t && (t = "y");
            var a = this.axis[t];
            if (
              this.options.clickOnTrack &&
              a.scrollbar.el &&
              this.contentWrapperEl
            ) {
              e.preventDefault();
              var l = hs(this.el);
              this.axis[t].scrollbar.rect =
                a.scrollbar.el.getBoundingClientRect();
              var c =
                  null !==
                    (i =
                      null === (s = this.axis[t].scrollbar.rect) || void 0 === s
                        ? void 0
                        : s[this.axis[t].offsetAttr]) && void 0 !== i
                    ? i
                    : 0,
                u = parseInt(
                  null !==
                    (o =
                      null === (n = this.elStyles) || void 0 === n
                        ? void 0
                        : n[this.axis[t].sizeAttr]) && void 0 !== o
                    ? o
                    : "0px",
                  10,
                ),
                d = this.contentWrapperEl[this.axis[t].scrollOffsetAttr],
                p =
                  ("y" === t ? this.mouseY - c : this.mouseX - c) < 0 ? -1 : 1,
                h = -1 === p ? d - u : d + u,
                f = function () {
                  r.contentWrapperEl &&
                    (-1 === p
                      ? d > h &&
                        ((d -= 40),
                        (r.contentWrapperEl[r.axis[t].scrollOffsetAttr] = d),
                        l.requestAnimationFrame(f))
                      : d < h &&
                        ((d += 40),
                        (r.contentWrapperEl[r.axis[t].scrollOffsetAttr] = d),
                        l.requestAnimationFrame(f)));
                };
              f();
            }
          }),
          (e.prototype.getContentElement = function () {
            return this.contentEl;
          }),
          (e.prototype.getScrollElement = function () {
            return this.contentWrapperEl;
          }),
          (e.prototype.removeListeners = function () {
            var e = hs(this.el);
            this.el.removeEventListener("mouseenter", this.onMouseEnter),
              this.el.removeEventListener(
                "pointerdown",
                this.onPointerEvent,
                !0,
              ),
              this.el.removeEventListener("mousemove", this.onMouseMove),
              this.el.removeEventListener("mouseleave", this.onMouseLeave),
              this.contentWrapperEl &&
                this.contentWrapperEl.removeEventListener(
                  "scroll",
                  this.onScroll,
                ),
              e.removeEventListener("resize", this.onWindowResize),
              this.mutationObserver && this.mutationObserver.disconnect(),
              this.resizeObserver && this.resizeObserver.disconnect(),
              this.onMouseMove.cancel(),
              this.onWindowResize.cancel(),
              this.onStopScrolling.cancel(),
              this.onMouseEntered.cancel();
          }),
          (e.prototype.unMount = function () {
            this.removeListeners();
          }),
          (e.prototype.isWithinBounds = function (e) {
            return (
              this.mouseX >= e.left &&
              this.mouseX <= e.left + e.width &&
              this.mouseY >= e.top &&
              this.mouseY <= e.top + e.height
            );
          }),
          (e.prototype.findChild = function (e, t) {
            var s =
              e.matches ||
              e.webkitMatchesSelector ||
              e.mozMatchesSelector ||
              e.msMatchesSelector;
            return Array.prototype.filter.call(e.children, function (e) {
              return s.call(e, t);
            })[0];
          }),
          (e.rtlHelpers = null),
          (e.defaultOptions = {
            forceVisible: !1,
            clickOnTrack: !0,
            scrollbarMinSize: 25,
            scrollbarMaxSize: 0,
            ariaLabel: "scrollable content",
            classNames: {
              contentEl: "simplebar-content",
              contentWrapper: "simplebar-content-wrapper",
              offset: "simplebar-offset",
              mask: "simplebar-mask",
              wrapper: "simplebar-wrapper",
              placeholder: "simplebar-placeholder",
              scrollbar: "simplebar-scrollbar",
              track: "simplebar-track",
              heightAutoObserverWrapperEl:
                "simplebar-height-auto-observer-wrapper",
              heightAutoObserverEl: "simplebar-height-auto-observer",
              visible: "simplebar-visible",
              horizontal: "simplebar-horizontal",
              vertical: "simplebar-vertical",
              hover: "simplebar-hover",
              dragging: "simplebar-dragging",
              scrolling: "simplebar-scrolling",
              scrollable: "simplebar-scrollable",
              mouseEntered: "simplebar-mouse-entered",
            },
            scrollableNode: null,
            contentNode: null,
            autoHide: !0,
          }),
          (e.getOptions = ms),
          (e.helpers = ps),
          e
        );
      })(),
      xs = function (e, t) {
        return (
          (xs =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (e, t) {
                e.__proto__ = t;
              }) ||
            function (e, t) {
              for (var s in t)
                Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
            }),
          xs(e, t)
        );
      };
    var Es = ys.helpers,
      ws = Es.getOptions,
      Ss = Es.addClasses,
      Os = (function (e) {
        function t() {
          for (var s = [], i = 0; i < arguments.length; i++)
            s[i] = arguments[i];
          var n = e.apply(this, s) || this;
          return t.instances.set(s[0], n), n;
        }
        return (
          (function (e, t) {
            if ("function" != typeof t && null !== t)
              throw new TypeError(
                "Class extends value " +
                  String(t) +
                  " is not a constructor or null",
              );
            function s() {
              this.constructor = e;
            }
            xs(e, t),
              (e.prototype =
                null === t
                  ? Object.create(t)
                  : ((s.prototype = t.prototype), new s()));
          })(t, e),
          (t.initDOMLoadedElements = function () {
            document.removeEventListener(
              "DOMContentLoaded",
              this.initDOMLoadedElements,
            ),
              window.removeEventListener("load", this.initDOMLoadedElements),
              Array.prototype.forEach.call(
                document.querySelectorAll("[data-simplebar]"),
                function (e) {
                  "init" === e.getAttribute("data-simplebar") ||
                    t.instances.has(e) ||
                    new t(e, ws(e.attributes));
                },
              );
          }),
          (t.removeObserver = function () {
            var e;
            null === (e = t.globalObserver) || void 0 === e || e.disconnect();
          }),
          (t.prototype.initDOM = function () {
            var e,
              t,
              s,
              i = this;
            if (
              !Array.prototype.filter.call(this.el.children, function (e) {
                return e.classList.contains(i.classNames.wrapper);
              }).length
            ) {
              for (
                this.wrapperEl = document.createElement("div"),
                  this.contentWrapperEl = document.createElement("div"),
                  this.offsetEl = document.createElement("div"),
                  this.maskEl = document.createElement("div"),
                  this.contentEl = document.createElement("div"),
                  this.placeholderEl = document.createElement("div"),
                  this.heightAutoObserverWrapperEl =
                    document.createElement("div"),
                  this.heightAutoObserverEl = document.createElement("div"),
                  Ss(this.wrapperEl, this.classNames.wrapper),
                  Ss(this.contentWrapperEl, this.classNames.contentWrapper),
                  Ss(this.offsetEl, this.classNames.offset),
                  Ss(this.maskEl, this.classNames.mask),
                  Ss(this.contentEl, this.classNames.contentEl),
                  Ss(this.placeholderEl, this.classNames.placeholder),
                  Ss(
                    this.heightAutoObserverWrapperEl,
                    this.classNames.heightAutoObserverWrapperEl,
                  ),
                  Ss(
                    this.heightAutoObserverEl,
                    this.classNames.heightAutoObserverEl,
                  );
                this.el.firstChild;

              )
                this.contentEl.appendChild(this.el.firstChild);
              this.contentWrapperEl.appendChild(this.contentEl),
                this.offsetEl.appendChild(this.contentWrapperEl),
                this.maskEl.appendChild(this.offsetEl),
                this.heightAutoObserverWrapperEl.appendChild(
                  this.heightAutoObserverEl,
                ),
                this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl),
                this.wrapperEl.appendChild(this.maskEl),
                this.wrapperEl.appendChild(this.placeholderEl),
                this.el.appendChild(this.wrapperEl),
                null === (e = this.contentWrapperEl) ||
                  void 0 === e ||
                  e.setAttribute("tabindex", "0"),
                null === (t = this.contentWrapperEl) ||
                  void 0 === t ||
                  t.setAttribute("role", "region"),
                null === (s = this.contentWrapperEl) ||
                  void 0 === s ||
                  s.setAttribute("aria-label", this.options.ariaLabel);
            }
            if (!this.axis.x.track.el || !this.axis.y.track.el) {
              var n = document.createElement("div"),
                o = document.createElement("div");
              Ss(n, this.classNames.track),
                Ss(o, this.classNames.scrollbar),
                n.appendChild(o),
                (this.axis.x.track.el = n.cloneNode(!0)),
                Ss(this.axis.x.track.el, this.classNames.horizontal),
                (this.axis.y.track.el = n.cloneNode(!0)),
                Ss(this.axis.y.track.el, this.classNames.vertical),
                this.el.appendChild(this.axis.x.track.el),
                this.el.appendChild(this.axis.y.track.el);
            }
            ys.prototype.initDOM.call(this),
              this.el.setAttribute("data-simplebar", "init");
          }),
          (t.prototype.unMount = function () {
            ys.prototype.unMount.call(this), t.instances.delete(this.el);
          }),
          (t.initHtmlApi = function () {
            (this.initDOMLoadedElements =
              this.initDOMLoadedElements.bind(this)),
              "undefined" != typeof MutationObserver &&
                ((this.globalObserver = new MutationObserver(
                  t.handleMutations,
                )),
                this.globalObserver.observe(document, {
                  childList: !0,
                  subtree: !0,
                })),
              "complete" === document.readyState ||
              ("loading" !== document.readyState &&
                !document.documentElement.doScroll)
                ? window.setTimeout(this.initDOMLoadedElements)
                : (document.addEventListener(
                    "DOMContentLoaded",
                    this.initDOMLoadedElements,
                  ),
                  window.addEventListener("load", this.initDOMLoadedElements));
          }),
          (t.handleMutations = function (e) {
            e.forEach(function (e) {
              e.addedNodes.forEach(function (e) {
                1 === e.nodeType &&
                  (e.hasAttribute("data-simplebar")
                    ? !t.instances.has(e) &&
                      document.documentElement.contains(e) &&
                      new t(e, ws(e.attributes))
                    : e
                        .querySelectorAll("[data-simplebar]")
                        .forEach(function (e) {
                          "init" !== e.getAttribute("data-simplebar") &&
                            !t.instances.has(e) &&
                            document.documentElement.contains(e) &&
                            new t(e, ws(e.attributes));
                        }));
              }),
                e.removedNodes.forEach(function (e) {
                  1 === e.nodeType &&
                    ("init" === e.getAttribute("data-simplebar")
                      ? t.instances.has(e) &&
                        !document.documentElement.contains(e) &&
                        t.instances.get(e).unMount()
                      : Array.prototype.forEach.call(
                          e.querySelectorAll('[data-simplebar="init"]'),
                          function (e) {
                            t.instances.has(e) &&
                              !document.documentElement.contains(e) &&
                              t.instances.get(e).unMount();
                          },
                        ));
                });
            });
          }),
          (t.instances = new WeakMap()),
          t
        );
      })(ys);
    At && Os.initHtmlApi();
    let As = !1;
    setTimeout(() => {
      if (As) {
        let e = new Event("windowScroll");
        window.addEventListener("scroll", function (t) {
          document.dispatchEvent(e);
        });
      }
    }, 0);
    let Cs = new IntersectionObserver(
        function (e) {
          e.forEach((e) => {
            e.isIntersecting && e.target.classList.add("element-show");
          });
        },
        { threshold: [0.5] },
      ),
      Ls = document.querySelectorAll(".element-animation");
    for (let e of Ls) Cs.observe(e);
    (window.FLS = !0),
      (function (e) {
        let t = new Image();
        (t.onload = t.onerror =
          function () {
            e(2 == t.height);
          }),
          (t.src =
            "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA");
      })(function (e) {
        let t = !0 === e ? "webp" : "no-webp";
        document.documentElement.classList.add(t);
      }),
      (function () {
        let e = document.querySelector(".icon-menu");
        e &&
          e.addEventListener("click", function (e) {
            o && (r(), document.documentElement.classList.toggle("menu-open"));
          });
      })(),
      new e({}),
      document.body.addEventListener("focusin", function (e) {
        const t = e.target;
        ("INPUT" !== t.tagName && "TEXTAREA" !== t.tagName) ||
          (t.dataset.placeholder && (t.placeholder = ""),
          t.classList.add("_form-focus"),
          t.parentElement.classList.add("_form-focus"),
          h.removeError(t));
      }),
      document.body.addEventListener("focusout", function (e) {
        const t = e.target;
        ("INPUT" !== t.tagName && "TEXTAREA" !== t.tagName) ||
          (t.dataset.placeholder && (t.placeholder = t.dataset.placeholder),
          t.classList.remove("_form-focus"),
          t.parentElement.classList.remove("_form-focus"),
          t.hasAttribute("data-validate") && h.validateInput(t));
      }),
      (function (e) {
        const t = document.forms;
        if (t.length)
          for (const e of t)
            e.addEventListener("submit", function (e) {
              s(e.target, e);
            }),
              e.addEventListener("reset", function (e) {
                const t = e.target;
                h.formClean(t);
              });
        async function s(t, s) {
          if (0 === (e ? h.getErrors(t) : 0)) {
            if (t.hasAttribute("data-ajax")) {
              s.preventDefault();
              const e = t.getAttribute("action")
                  ? t.getAttribute("action").trim()
                  : "#",
                n = t.getAttribute("method")
                  ? t.getAttribute("method").trim()
                  : "GET",
                o = new FormData(t);
              t.classList.add("_sending");
              const r = await fetch(e, { method: n, body: o });
              if (r.ok) {
                await r.json();
                t.classList.remove("_sending"), i(t);
              } else alert("Ошибка"), t.classList.remove("_sending");
            } else t.hasAttribute("data-dev") && (s.preventDefault(), i(t));
          } else {
            s.preventDefault();
            const e = t.querySelector("._form-error");
            e && t.hasAttribute("data-goto-error") && u(e, !0, 1e3);
          }
        }
        function i(e) {
          document.dispatchEvent(
            new CustomEvent("formSent", { detail: { form: e } }),
          ),
            h.formClean(e),
            c(`[Формы]: ${"Форма отправлена!"}`);
        }
      })(!0),
      (p.selectModule = new d({})),
      (function () {
        function e(e) {
          if ("click" === e.type) {
            const t = e.target;
            if (t.closest("[data-goto]")) {
              const s = t.closest("[data-goto]"),
                i = s.dataset.goto ? s.dataset.goto : "",
                n = !!s.hasAttribute("data-goto-header"),
                o = s.dataset.gotoSpeed ? s.dataset.gotoSpeed : "500";
              u(i, n, o), e.preventDefault();
            }
          } else if ("watcherCallback" === e.type && e.detail) {
            const t = e.detail.entry,
              s = t.target;
            if ("navigator" === s.dataset.watch) {
              const e = s.id,
                i =
                  (document.querySelector("[data-goto]._navigator-active"),
                  document.querySelector(`[data-goto="${e}"]`));
              t.isIntersecting
                ? i && i.classList.add("_navigator-active")
                : i && i.classList.remove("_navigator-active");
            }
          }
        }
        document.addEventListener("click", e),
          document.addEventListener("watcherCallback", e);
      })();
  })();
})();
