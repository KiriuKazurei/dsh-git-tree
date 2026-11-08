window.__ModuleLoader__.load({id:"dsh-git-tree",factory:(require)=>{var module={exports:{}};var exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.jsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = __toESM(require("react"), 1);

// src/client/styles.css
var styles_default = "/* dsh-git-tree \u2014 scoped styles. Only host theme tokens are referenced; the\n   graph lane palette lives in graph.js and is applied as SVG stroke/fill. */\n\n.dshg-widget,\n.dshg-pill,\n.dshg-drawer {\n  color: var(--dsw-alias-label-primary, #ededed);\n  font-family: inherit;\n  box-sizing: border-box;\n  pointer-events: auto;\n}\n\n.dshg-widget *,\n.dshg-pill *,\n.dshg-drawer * {\n  box-sizing: border-box;\n}\n\n/* \u2500\u2500 floating card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.dshg-widget {\n  position: fixed;\n  top: 96px;\n  right: 64px;\n  width: 256px;\n  max-height: min(380px, calc(100vh - 120px));\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  background: var(--dsw-alias-bg-layer-1, #1b1c1f);\n  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.09));\n  border-radius: 12px;\n  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.18);\n  font-size: 12px;\n  z-index: 1;\n}\n\n.dshg-head {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 8px 12px 6px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n}\n\n.dshg-head-glyph {\n  display: inline-flex;\n  align-items: center;\n  color: var(--dsw-alias-brand-primary, #4c8dff);\n  flex: none;\n}\n\n.dshg-glyph {\n  display: block;\n}\n\n.dshg-branch {\n  flex: 0 1 auto;\n  max-width: 112px;\n  min-width: 0;\n  padding: 0;\n  border: 0;\n  background: none;\n  color: var(--dsw-alias-label-primary, #ededed);\n  font: inherit;\n  font-weight: 600;\n  font-size: 12px;\n  text-align: left;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  cursor: pointer;\n}\n\n.dshg-branch:hover {\n  color: var(--dsw-alias-brand-primary, #4c8dff);\n}\n\n.dshg-head-spacer {\n  flex: 1;\n  min-width: 0;\n}\n\n/* Drag handle between the branch name and the action buttons: a small grey\n   bar that brightens under the pointer and turns the whole card movable. */\n.dshg-drag {\n  flex: 1;\n  min-width: 24px;\n  align-self: stretch;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  border-radius: 5px;\n  cursor: grab;\n  touch-action: none;\n  outline: none;\n}\n\n.dshg-drag:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, #4c8dff);\n  outline-offset: -2px;\n}\n\n.dshg-drag:active {\n  cursor: grabbing;\n}\n\n.dshg-drag-bar {\n  display: block;\n  width: 34px;\n  height: 3px;\n  /* The handle box starts at the header's 8px padding (plus the card's 1px\n     border); a 1px top margin places the bar exactly 10px from the card's\n     top edge. */\n  margin-top: 1px;\n  border-radius: 999px;\n  background: var(--dsw-alias-label-secondary, #9ba1a6);\n  opacity: 0.42;\n  transition: opacity 120ms ease, width 120ms ease;\n}\n\n.dshg-drag:hover .dshg-drag-bar {\n  width: 38px;\n  opacity: 0.95;\n}\n\n.dshg-drag:focus-visible .dshg-drag-bar {\n  opacity: 0.95;\n}\n\n.dshg-drag:active .dshg-drag-bar {\n  opacity: 1;\n}\n\n.dshg-iconbtn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  padding: 0;\n  flex: none;\n  border: 0;\n  border-radius: 6px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  cursor: pointer;\n}\n\n.dshg-iconbtn:hover {\n  background: rgba(127, 127, 127, 0.16);\n  color: var(--dsw-alias-label-primary, #ededed);\n}\n\n.dshg-iconbtn:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, #4c8dff);\n  outline-offset: 1px;\n}\n\n.dshg-clean,\n.dshg-dirty {\n  display: inline-block;\n  width: 6px;\n  height: 6px;\n  flex: none;\n  border-radius: 50%;\n}\n\n.dshg-clean {\n  background: var(--dsw-alias-state-success-primary, #2ecc71);\n  opacity: 0.55;\n}\n\n.dshg-dirty {\n  background: var(--dsw-alias-state-warn-primary, #f0a020);\n}\n\n.dshg-strip {\n  display: flex;\n  gap: 4px;\n  flex: none;\n  overflow-x: auto;\n  overflow-y: hidden;\n  padding: 5px 12px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n  scrollbar-width: none;\n}\n\n.dshg-strip::-webkit-scrollbar {\n  display: none;\n}\n\n.dshg-strip-wide {\n  padding: 6px 12px;\n}\n\n.dshg-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  flex: none;\n  max-width: 118px;\n  height: 18px;\n  padding: 0 7px;\n  border-radius: 999px;\n  background: rgba(127, 127, 127, 0.14);\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10px;\n  line-height: 18px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dshg-chip-current {\n  background: rgba(76, 141, 255, 0.18);\n  color: var(--dsw-alias-brand-primary, #4c8dff);\n}\n\n.dshg-chip-remote {\n  opacity: 0.72;\n}\n\n.dshg-chip-track {\n  font-style: normal;\n  font-size: 9px;\n  opacity: 0.8;\n}\n\n.dshg-list {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 2px 4px;\n  scrollbar-width: thin;\n}\n\n.dshg-list::-webkit-scrollbar,\n.dshg-detail-scroll::-webkit-scrollbar,\n.dshg-detail-list::-webkit-scrollbar,\n.dshg-detail-info::-webkit-scrollbar,\n.dshg-diff-scroll::-webkit-scrollbar,\n.dshg-diff::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n\n.dshg-list::-webkit-scrollbar-thumb,\n.dshg-detail-scroll::-webkit-scrollbar-thumb,\n.dshg-detail-list::-webkit-scrollbar-thumb,\n.dshg-detail-info::-webkit-scrollbar-thumb,\n.dshg-diff-scroll::-webkit-scrollbar-thumb,\n.dshg-diff::-webkit-scrollbar-thumb {\n  background: rgba(127, 127, 127, 0.35);\n  border-radius: 999px;\n}\n\n.dshg-canvas {\n  position: relative;\n}\n\n.dshg-graph {\n  position: absolute;\n  left: 0;\n  top: 0;\n  overflow: hidden;\n  pointer-events: none;\n}\n\n.dshg-graph svg {\n  display: block;\n}\n\n.dshg-row {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding-right: 8px;\n  border-radius: 6px;\n  cursor: pointer;\n}\n\n.dshg-row:hover {\n  background: rgba(127, 127, 127, 0.13);\n}\n\n.dshg-row-selected {\n  background: rgba(76, 141, 255, 0.16);\n}\n\n.dshg-row:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, #4c8dff);\n  outline-offset: -2px;\n}\n\n.dshg-hash {\n  flex: none;\n  min-width: 38px;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;\n  font-size: 10px;\n}\n\n.dshg-subject {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 11px;\n}\n\n.dshg-time {\n  flex: none;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 9.5px;\n  margin-left: 4px;\n}\n\n.dshg-foot {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex: none;\n  padding: 3px 10px 3px 14px;\n  border-top: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10px;\n}\n\n.dshg-foot-text {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* \u2500\u2500 empty / error states \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.dshg-empty {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n  padding: 14px 16px;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 11px;\n  line-height: 1.5;\n}\n\n.dshg-empty-title {\n  color: var(--dsw-alias-label-primary, #ededed);\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.dshg-empty-hint {\n  word-break: break-word;\n}\n\n.dshg-error {\n  color: var(--dsw-alias-state-error-primary, #e5484d);\n  font-size: 11px;\n  line-height: 1.5;\n  word-break: break-word;\n}\n\n.dshg-link {\n  align-self: flex-start;\n  padding: 2px 0;\n  border: 0;\n  background: none;\n  color: var(--dsw-alias-brand-primary, #4c8dff);\n  font: inherit;\n  font-size: 11px;\n  text-align: left;\n  cursor: pointer;\n}\n\n.dshg-link:hover {\n  text-decoration: underline;\n}\n\n/* \u2500\u2500 hover tooltip \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.dshg-tooltip {\n  position: fixed;\n  z-index: 1000;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 10px 12px;\n  border: 1px solid var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.16));\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-overlay, #232428);\n  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.38);\n  pointer-events: none;\n  font-size: 11px;\n  line-height: 1.45;\n}\n\n.dshg-tooltip-subject {\n  color: var(--dsw-alias-label-primary, #ededed);\n  font-size: 12px;\n  font-weight: 600;\n  line-height: 1.4;\n  word-break: break-word;\n}\n\n.dshg-tooltip-meta {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10.5px;\n  font-variant-numeric: tabular-nums;\n}\n\n.dshg-tooltip-hash {\n  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;\n  color: var(--dsw-alias-brand-primary, #4c8dff);\n}\n\n.dshg-tooltip-author {\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10.5px;\n}\n\n.dshg-tooltip-body {\n  max-height: 132px;\n  overflow: hidden;\n  color: var(--dsw-alias-label-primary, #ededed);\n  font-size: 10.5px;\n  line-height: 1.5;\n  white-space: pre-wrap;\n  word-break: break-word;\n  border-left: 2px solid var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.16));\n  padding-left: 8px;\n}\n\n.dshg-tooltip-refs {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n}\n\n.dshg-tooltip-merge {\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10px;\n}\n\n.dshg-tooltip-hint {\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10px;\n  opacity: 0.8;\n}\n\n/* \u2500\u2500 refs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.dshg-refs {\n  display: inline-flex;\n  flex-wrap: wrap;\n  gap: 4px;\n  min-width: 0;\n}\n\n.dshg-ref {\n  display: inline-flex;\n  align-items: center;\n  max-width: 130px;\n  height: 16px;\n  padding: 0 5px;\n  border-radius: 4px;\n  background: rgba(127, 127, 127, 0.16);\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 9.5px;\n  line-height: 16px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dshg-ref-head {\n  background: rgba(76, 141, 255, 0.22);\n  color: var(--dsw-alias-brand-primary, #4c8dff);\n}\n\n.dshg-ref-tag {\n  background: rgba(240, 160, 32, 0.18);\n  color: var(--dsw-alias-state-warn-primary, #f0a020);\n}\n\n/* \u2500\u2500 collapsed pill \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.dshg-pill {\n  position: fixed;\n  top: 96px;\n  right: 64px;\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  padding: 3px 4px 3px 8px;\n  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.1));\n  border-radius: 999px;\n  background: var(--dsw-alias-bg-layer-1, #1b1c1f);\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);\n  z-index: 1;\n  max-width: 220px;\n}\n\n.dshg-pill-main {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  padding: 0 4px 0 0;\n  border: 0;\n  background: none;\n  color: var(--dsw-alias-label-primary, #ededed);\n  font: inherit;\n  font-size: 11px;\n  cursor: pointer;\n}\n\n.dshg-pill-main .dshg-glyph {\n  color: var(--dsw-alias-brand-primary, #4c8dff);\n}\n\n.dshg-pill-branch {\n  max-width: 140px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-weight: 600;\n}\n\n/* \u2500\u2500 detail pane \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.dshg-detail {\n  --dshg-code-keyword: var(--dsw-alias-brand-primary, #4c8dff);\n  --dshg-code-string: var(--dsw-alias-state-success-primary, #2ecc71);\n  --dshg-code-number: var(--dsw-alias-state-warn-primary, #f0a020);\n  --dshg-code-comment: var(--dsw-alias-label-secondary, #9ba1a6);\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-height: 220px;\n  min-width: 0;\n  color: var(--dsw-alias-label-primary, #ededed);\n  font-size: 12px;\n}\n\n.dshg-detail-head-commit {\n  gap: 8px;\n}\n\n.dshg-commit-short {\n  flex: none;\n  padding: 2px 6px;\n  border-radius: 4px;\n  background: rgba(127, 127, 127, 0.14);\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;\n  font-size: 10px;\n  line-height: 1.4;\n}\n\n.dshg-detail-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: none;\n  padding: 10px 14px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n}\n\n.dshg-detail-repo {\n  flex: 1;\n  min-width: 0;\n}\n\n.dshg-detail-name {\n  font-weight: 600;\n  font-size: 12.5px;\n  line-height: 1.3;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dshg-detail-path {\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10px;\n  line-height: 1.4;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* Vertical detail: commit facts on top, the patch expanded below in a\n   bounded code box with its own vertical and horizontal scroll. */\n.dshg-detail-body {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  scrollbar-width: thin;\n}\n\n.dshg-detail-info {\n  min-width: 0;\n  padding: 16px max(18px, calc((100% - 900px) / 2)) 18px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n}\n\n.dshg-detail-diff {\n  min-height: 0;\n  background: var(--dsw-alias-bg-base, #141518);\n}\n\n.dshg-code-toolbar {\n  position: sticky;\n  top: 0;\n  z-index: 3;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: none;\n  padding: 8px 14px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n  background: var(--dsw-alias-bg-layer-2, rgba(255, 255, 255, 0.04));\n  font-size: 11px;\n}\n\n.dshg-code-title {\n  flex: none;\n  font-weight: 600;\n}\n\n.dshg-code-stat {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 6px;\n  flex: none;\n  font-size: 10.5px;\n  font-variant-numeric: tabular-nums;\n}\n\n.dshg-code-count {\n  flex: none;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10px;\n}\n\n.dshg-textbtn {\n  flex: none;\n  padding: 3px 6px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font: inherit;\n  font-size: 10.5px;\n  cursor: pointer;\n  transition: background 150ms ease, color 150ms ease;\n}\n\n.dshg-textbtn:hover {\n  background: rgba(127, 127, 127, 0.14);\n  color: var(--dsw-alias-label-primary, #ededed);\n}\n\n.dshg-textbtn:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, #4c8dff);\n  outline-offset: 1px;\n}\n\n.dshg-wrapbtn {\n  flex: none;\n  padding: 3px 8px;\n  border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.14));\n  border-radius: 6px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font: inherit;\n  font-size: 10.5px;\n  cursor: pointer;\n  transition: background 150ms ease, color 150ms ease;\n}\n\n.dshg-wrapbtn:hover {\n  background: rgba(127, 127, 127, 0.14);\n  color: var(--dsw-alias-label-primary, #ededed);\n}\n\n.dshg-wrapbtn-on {\n  border-color: transparent;\n  background: rgba(76, 141, 255, 0.18);\n  color: var(--dsw-alias-brand-primary, #4c8dff);\n}\n\n.dshg-wrapbtn:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, #4c8dff);\n  outline-offset: 1px;\n}\n\n.dshg-commit-tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin-top: 8px;\n}\n\n.dshg-tag {\n  display: inline-flex;\n  align-items: center;\n  height: 20px;\n  padding: 0 7px;\n  border-radius: 999px;\n  background: rgba(127, 127, 127, 0.14);\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10px;\n  line-height: 20px;\n  white-space: nowrap;\n}\n\n.dshg-tag-merge {\n  background: rgba(240, 160, 32, 0.16);\n  color: var(--dsw-alias-state-warn-primary, #f0a020);\n}\n\n.dshg-detail-scroll {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 10px 12px 16px;\n}\n\n.dshg-summary {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: none;\n  padding: 6px 12px;\n  color: var(--dsw-alias-label-primary, #ededed);\n  font-size: 11px;\n  font-weight: 600;\n  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n}\n\n.dshg-summary-detached {\n  color: var(--dsw-alias-state-warn-primary, #f0a020);\n}\n\n.dshg-summary-work {\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-weight: 400;\n  font-size: 10px;\n}\n\n.dshg-detail-list {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 4px 0;\n}\n\n.dshg-detail-foot {\n  flex: none;\n  min-height: 18px;\n  padding: 3px 12px;\n  border-top: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10px;\n}\n\n.dshg-back {\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n  padding: 2px 6px 2px 2px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font: inherit;\n  font-size: 11px;\n  cursor: pointer;\n}\n\n.dshg-back:hover {\n  background: rgba(127, 127, 127, 0.14);\n  color: var(--dsw-alias-label-primary, #ededed);\n}\n\n.dshg-back:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, #4c8dff);\n  outline-offset: 1px;\n}\n\n.dshg-commit-title {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 1.45;\n  word-break: break-word;\n}\n\n.dshg-commit-meta {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n  margin: 10px 0;\n}\n\n.dshg-kv {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 11px;\n  line-height: 1.4;\n}\n\n.dshg-kv > span:first-child {\n  flex: none;\n  width: 60px;\n}\n\n.dshg-kv > b {\n  color: var(--dsw-alias-label-primary, #ededed);\n  font-weight: 500;\n  word-break: break-word;\n}\n\n.dshg-hashbtn {\n  padding: 0;\n  border: 0;\n  background: none;\n  color: var(--dsw-alias-brand-primary, #4c8dff);\n  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;\n  font-size: 10.5px;\n  cursor: pointer;\n  word-break: break-all;\n  text-align: left;\n}\n\n.dshg-hashbtn:hover {\n  text-decoration: underline;\n}\n\n.dshg-parents {\n  display: inline-flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n\n.dshg-parents code {\n  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;\n  font-size: 10.5px;\n  color: var(--dsw-alias-label-primary, #ededed);\n  background: rgba(127, 127, 127, 0.14);\n  border-radius: 4px;\n  padding: 1px 5px;\n}\n\n.dshg-commit-body {\n  margin: 10px 0;\n  padding: 8px 10px;\n  border-radius: 8px;\n  background: rgba(127, 127, 127, 0.1);\n  color: var(--dsw-alias-label-primary, #ededed);\n  font-family: inherit;\n  font-size: 11.5px;\n  line-height: 1.55;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n\n.dshg-file-list {\n  display: block;\n}\n\n.dshg-file-entry {\n  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n}\n\n.dshg-file-entry:last-child {\n  border-bottom: 0;\n}\n\n.dshg-file-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  padding: 7px 14px;\n  border: 0;\n  background: none;\n  color: inherit;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n\n.dshg-file-row:hover {\n  background: rgba(127, 127, 127, 0.08);\n}\n\n.dshg-file-row:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, #4c8dff);\n  outline-offset: -2px;\n}\n\n.dshg-file-row[aria-expanded='true'] {\n  background: rgba(127, 127, 127, 0.06);\n}\n\n.dshg-file-caret {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: none;\n  width: 16px;\n  height: 16px;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  transition: transform 150ms ease, color 150ms ease;\n}\n\n.dshg-file-row[aria-expanded='true'] .dshg-file-caret {\n  transform: rotate(90deg);\n  color: var(--dsw-alias-label-primary, #ededed);\n}\n\n.dshg-file-row .dshg-file-path {\n  flex: 1;\n}\n\n.dshg-file-diff {\n  border-top: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n  background: var(--dsw-alias-bg-base, #141518);\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.dshg-file-diff .dshg-empty-hint {\n  padding: 10px 14px;\n}\n\n.dshg-file-path {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;\n  font-size: 10.5px;\n  color: var(--dsw-alias-label-primary, #ededed);\n}\n\n.dshg-file-stat {\n  flex: none;\n  font-size: 10px;\n  font-variant-numeric: tabular-nums;\n}\n\n.dshg-add {\n  color: var(--dsw-alias-state-success-primary, #2ecc71);\n  font-style: normal;\n}\n\n.dshg-del {\n  margin-left: 4px;\n  color: var(--dsw-alias-state-error-primary, #e5484d);\n  font-style: normal;\n}\n\n.dshg-diff {\n  min-width: 100%;\n  width: max-content;\n  padding-bottom: 8px;\n  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;\n  font-size: 11px;\n  line-height: 1.6;\n}\n\n.dshg-diff-wrap .dshg-diff {\n  width: auto;\n  min-width: 0;\n}\n\n.dshg-diff-file {\n  position: sticky;\n  top: 0;\n  z-index: 2;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 6px 14px;\n  border-top: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n  background: var(--dsw-alias-bg-layer-2, #222327);\n  font-size: 11px;\n}\n\n.dshg-diff-file:first-child {\n  border-top: 0;\n}\n\n.dshg-diff-file-path {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 10.5px;\n  font-weight: 600;\n}\n\n.dshg-diff-file-stat {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 6px;\n  flex: none;\n  font-size: 10px;\n  font-variant-numeric: tabular-nums;\n}\n\n.dshg-diff-line {\n  display: flex;\n  align-items: flex-start;\n  width: max-content;\n  min-width: 100%;\n  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;\n  font-size: 11px;\n  line-height: 1.6;\n}\n\n.dshg-diff-gutter {\n  flex: none;\n  width: 38px;\n  padding-right: 8px;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  opacity: 0.7;\n  text-align: right;\n  user-select: none;\n  font-variant-numeric: tabular-nums;\n}\n\n.dshg-diff-mark {\n  flex: none;\n  width: 16px;\n  text-align: center;\n  user-select: none;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n}\n\n.dshg-diff-mark-add {\n  color: var(--dsw-alias-state-success-primary, #2ecc71);\n}\n\n.dshg-diff-mark-del {\n  color: var(--dsw-alias-state-error-primary, #e5484d);\n}\n\n.dshg-diff-text {\n  display: block;\n  flex: 1;\n  padding-right: 16px;\n  white-space: pre;\n  tab-size: 4;\n}\n\n.dshg-diff-add {\n  background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #2ecc71) 12%, transparent);\n}\n\n.dshg-diff-del {\n  background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #e5484d) 12%, transparent);\n}\n\n.dshg-diff-context:hover {\n  background: rgba(127, 127, 127, 0.07);\n}\n\n.dshg-diff-hunk {\n  padding: 1px 14px;\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary, #4c8dff) 10%, transparent);\n  color: var(--dsw-alias-brand-primary, #4c8dff);\n}\n\n.dshg-diff-meta {\n  padding: 0 14px;\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  opacity: 0.72;\n}\n\n.dshg-diff-meta .dshg-diff-text {\n  padding-right: 14px;\n}\n\n.dshg-diff-note {\n  padding: 8px 14px;\n  border-top: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n  color: var(--dsw-alias-label-secondary, #9ba1a6);\n  font-size: 10px;\n}\n\n.dshg-diff-wrap .dshg-diff-line {\n  width: auto;\n  min-width: 0;\n}\n\n.dshg-diff-wrap .dshg-diff-text {\n  padding-right: 12px;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n\n/* Syntax tokens: semantic host colors, so both themes stay legible. */\n.dshg-tok-keyword {\n  color: var(--dshg-code-keyword);\n}\n\n.dshg-tok-string {\n  color: var(--dshg-code-string);\n}\n\n.dshg-tok-number {\n  color: var(--dshg-code-number);\n}\n\n.dshg-tok-comment {\n  color: var(--dshg-code-comment);\n  font-style: italic;\n}\n\n.dshg-tok-heading {\n  color: var(--dshg-code-keyword);\n  font-weight: 600;\n}\n\n.dshg-tok-strong {\n  font-weight: 700;\n}\n\n.dshg-tok-code {\n  padding: 0 2px;\n  border-radius: 3px;\n  background: rgba(127, 127, 127, 0.16);\n}\n\n.dshg-tok-link {\n  color: var(--dshg-code-keyword);\n  text-decoration: underline;\n}\n\n.dshg-tok-tag {\n  color: var(--dshg-code-number);\n}\n\n.dshg-tok-punct {\n  color: var(--dshg-code-comment);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dshg-wrapbtn,\n  .dshg-textbtn,\n  .dshg-file-caret {\n    transition: none;\n  }\n}\n\n/* \u2500\u2500 fallback drawer (used only when ctx.sidebarRight is absent) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.dshg-drawer {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: min(440px, 92vw);\n  display: flex;\n  flex-direction: column;\n  background: var(--dsw-alias-bg-base, #141518);\n  border-left: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.1));\n  box-shadow: -14px 0 38px rgba(0, 0, 0, 0.32);\n  z-index: 2;\n}\n\n.dshg-drawer-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex: none;\n  padding: 8px 8px 8px 12px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.08));\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.dshg-drawer-body {\n  flex: 1;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n";

// src/client/graph.js
var LANE_WIDTH = 12;
var ROW_HEIGHT = 22;
var LANE_COLORS = [
  "var(--dsw-alias-brand-primary, #4c8dff)",
  "var(--dsw-alias-state-success-primary, #2ecc71)",
  "var(--dsw-alias-state-warn-primary, #f0a020)",
  "var(--dsw-alias-state-error-primary, #e5484d)",
  "#a371f7",
  "#39c5cf",
  "#db61a2",
  "#8b949e"
];
function layoutGraph(commits) {
  const lanes = [];
  const rows = [];
  const rowByHash = /* @__PURE__ */ new Map();
  let nextColor = 0;
  const allocateLane = () => {
    const empty = lanes.findIndex((lane) => lane.hash === null);
    if (empty >= 0) return empty;
    lanes.push({ hash: null, color: LANE_COLORS[nextColor++ % LANE_COLORS.length] });
    return lanes.length - 1;
  };
  for (let index = 0; index < commits.length; index += 1) {
    const commit = commits[index];
    const parents = Array.isArray(commit.parents) ? commit.parents.filter(Boolean) : [];
    let lane = lanes.findIndex((candidate) => candidate.hash === commit.hash);
    if (lane < 0) lane = allocateLane();
    const color = lanes[lane].color;
    for (let other = lane + 1; other < lanes.length; other += 1) {
      if (lanes[other].hash === commit.hash) lanes[other] = { hash: null, color: lanes[other].color };
    }
    const parentLanes = [];
    if (parents.length === 0) {
      lanes[lane] = { hash: null, color };
    } else {
      lanes[lane] = { hash: parents[0], color };
      parentLanes.push(lane);
      for (let parentIndex = 1; parentIndex < parents.length; parentIndex += 1) {
        const wanted = parents[parentIndex];
        let parentLane = lanes.findIndex((candidate, candidateIndex) => candidateIndex !== lane && candidate.hash === wanted);
        if (parentLane < 0) {
          parentLane = allocateLane();
          lanes[parentLane] = { hash: wanted, color: lanes[parentLane].color };
        }
        parentLanes.push(parentLane);
      }
    }
    rows.push({
      commit,
      index,
      lane,
      color,
      parents: parents.map((hash, parentIndex) => ({
        hash,
        lane: parentLanes[parentIndex] ?? lane,
        row: null
      }))
    });
    rowByHash.set(commit.hash, index);
    while (lanes.length > 0 && lanes[lanes.length - 1].hash === null) lanes.pop();
  }
  for (const row of rows) {
    for (const parent of row.parents) {
      const parentIndex = rowByHash.get(parent.hash);
      parent.row = parentIndex === void 0 ? null : parentIndex;
    }
  }
  const maxLane = rows.reduce(
    (highest, row) => Math.max(highest, row.lane, ...row.parents.map((parent) => parent.lane)),
    0
  );
  const laneCount = rows.length === 0 ? 1 : maxLane + 1;
  return {
    rows,
    laneCount,
    laneWidth: LANE_WIDTH,
    rowHeight: ROW_HEIGHT,
    height: rows.length * ROW_HEIGHT
  };
}
function laneX(lane) {
  return lane * LANE_WIDTH + LANE_WIDTH / 2 + 1;
}
function rowY(index) {
  return index * ROW_HEIGHT + ROW_HEIGHT / 2;
}

// src/client/diff.js
var LANGUAGE_BY_EXTENSION = {
  md: "markdown",
  markdown: "markdown",
  mdx: "markdown",
  js: "js",
  jsx: "js",
  mjs: "js",
  cjs: "js",
  ts: "js",
  tsx: "js",
  json: "json",
  jsonc: "json",
  css: "css",
  scss: "css",
  less: "css",
  html: "html",
  htm: "html",
  xml: "html",
  svg: "html",
  py: "python",
  go: "go",
  rs: "rust",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  ps1: "shell",
  yml: "yaml",
  yaml: "yaml",
  toml: "toml",
  sql: "sql"
};
function detectLanguage(path) {
  const clean = String(path ?? "").split("#")[0].split("?")[0];
  const dot = clean.lastIndexOf(".");
  if (dot === -1) return "text";
  const extension = clean.slice(dot + 1).toLowerCase();
  return LANGUAGE_BY_EXTENSION[extension] ?? "text";
}
var JS_KEYWORDS = new Set("const let var function return if else for while do switch case break continue new class extends super import export from default async await try catch finally throw typeof instanceof in of this null undefined true false interface type enum implements public private protected readonly static as satisfies delete void yield declare namespace abstract keyof infer is".split(" "));
var PYTHON_KEYWORDS = new Set("def class import from return if elif else for while try except finally with as lambda pass break continue raise yield global nonlocal assert del in is not and or None True False async await match case".split(" "));
var GO_KEYWORDS = new Set("package import func return if else for range switch case break continue var const type struct interface map chan go defer select nil true false fallthrough goto".split(" "));
var RUST_KEYWORDS = new Set("fn let mut const static struct enum impl trait pub use mod crate super self Self return if else match for while loop break continue async await move ref dyn where unsafe true false Some None Ok Err as in".split(" "));
var SHELL_KEYWORDS = new Set("if then else elif fi for in do done case esac while until function return local export exit set unset echo read shift source alias printf true false".split(" "));
var SQL_KEYWORDS = new Set("select from where insert into values update set delete create table alter drop join left right inner outer on group by order having limit offset as and or not null is in like distinct union all exists between primary key foreign references index view begin commit rollback".split(" "));
var CONFIGS = {
  js: { line: ["//"], block: [["/*", "*/"]], strings: ['"', "'", "`"], keywords: JS_KEYWORDS },
  json: { strings: ['"'], keywords: /* @__PURE__ */ new Set(["true", "false", "null"]) },
  css: {
    block: [["/*", "*/"]],
    strings: ['"', "'"],
    keywords: /* @__PURE__ */ new Set(["important", "media", "supports", "keyframes", "import", "from", "to"])
  },
  python: { line: ["#"], strings: ['"', "'"], keywords: PYTHON_KEYWORDS },
  go: { line: ["//"], block: [["/*", "*/"]], strings: ['"', "'", "`"], keywords: GO_KEYWORDS },
  rust: { line: ["//"], block: [["/*", "*/"]], strings: ['"', "'"], keywords: RUST_KEYWORDS },
  shell: { line: ["#"], strings: ['"', "'"], keywords: SHELL_KEYWORDS },
  sql: { line: ["--"], block: [["/*", "*/"]], strings: ["'", '"'], keywords: SQL_KEYWORDS, lower: true },
  yaml: { line: ["#"], strings: ['"', "'"], keywords: /* @__PURE__ */ new Set(["true", "false", "null"]) },
  toml: { line: ["#"], strings: ['"', "'"], keywords: /* @__PURE__ */ new Set(["true", "false"]) },
  html: { block: [["<!--", "-->"]], strings: ['"', "'"], keywords: /* @__PURE__ */ new Set([]) },
  text: { keywords: /* @__PURE__ */ new Set() }
};
function isIdentifierStart(character) {
  return /[A-Za-z_$]/.test(character);
}
function isIdentifierPart(character) {
  return /[A-Za-z0-9_$]/.test(character);
}
function tokenizeLine(text, language = "text") {
  if (typeof text !== "string" || text === "") return [];
  if (language === "markdown") return tokenizeMarkdown(text);
  const config = CONFIGS[language] ?? CONFIGS.text;
  const tokens = [];
  let plain = "";
  let index = 0;
  const flush = () => {
    if (plain !== "") {
      tokens.push({ text: plain, kind: "plain" });
      plain = "";
    }
  };
  while (index < text.length) {
    let handled = false;
    for (const [open, close] of config.block ?? []) {
      if (text.startsWith(open, index)) {
        flush();
        const end = text.indexOf(close, index + open.length);
        const stop = end === -1 ? text.length : end + close.length;
        tokens.push({ text: text.slice(index, stop), kind: "comment" });
        index = stop;
        handled = true;
        break;
      }
    }
    if (handled) continue;
    for (const open of config.line ?? []) {
      if (text.startsWith(open, index)) {
        flush();
        tokens.push({ text: text.slice(index), kind: "comment" });
        index = text.length;
        handled = true;
        break;
      }
    }
    if (handled) continue;
    const character = text[index];
    if ((config.strings ?? []).includes(character)) {
      flush();
      let cursor = index + 1;
      while (cursor < text.length) {
        if (text[cursor] === "\\") {
          cursor += 2;
          continue;
        }
        if (text[cursor] === character) {
          cursor += 1;
          break;
        }
        cursor += 1;
      }
      tokens.push({ text: text.slice(index, cursor), kind: "string" });
      index = cursor;
      continue;
    }
    if (/[0-9]/.test(character) && !isIdentifierPart(text[index - 1] ?? "")) {
      flush();
      let cursor = index + 1;
      while (cursor < text.length && /[0-9a-fA-FxX._]/.test(text[cursor])) cursor += 1;
      tokens.push({ text: text.slice(index, cursor), kind: "number" });
      index = cursor;
      continue;
    }
    if (isIdentifierStart(character)) {
      flush();
      let cursor = index + 1;
      while (cursor < text.length && isIdentifierPart(text[cursor])) cursor += 1;
      const word = text.slice(index, cursor);
      const candidate = config.lower ? word.toLowerCase() : word;
      if (config.keywords?.has(candidate)) {
        tokens.push({ text: word, kind: "keyword" });
      } else {
        plain += word;
      }
      index = cursor;
      continue;
    }
    plain += character;
    index += 1;
  }
  flush();
  return tokens;
}
function tokenizeMarkdown(text) {
  if (/^\s{0,3}#{1,6}\s/.test(text)) return [{ text, kind: "heading" }];
  const tokens = [];
  const pattern = /(`[^`]*`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\[[^\]]+\]\([^)]*\))|(<[^>]+>)|(^>+)|(^\s*(?:[-*+]|\d+\.)\s)/g;
  let last = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) tokens.push({ text: text.slice(last, match.index), kind: "plain" });
    tokens.push({
      text: match[0],
      kind: match[1] ? "code" : match[2] || match[3] ? "strong" : match[4] ? "link" : match[5] ? "tag" : "punct"
    });
    last = match.index + match[0].length;
  }
  if (last < text.length) tokens.push({ text: text.slice(last), kind: "plain" });
  return tokens.length > 0 ? tokens : [{ text, kind: "plain" }];
}
function parseGitPath(line) {
  const match = /^diff --git a\/(.+?) b\/(.+)$/.exec(line);
  if (match) return match[2];
  return "";
}
function mergeFileEntries(diffFiles, statFiles) {
  const entries = [];
  const byPath = /* @__PURE__ */ new Map();
  for (const file of diffFiles ?? []) {
    const path = file.path || "";
    if (byPath.has(path)) continue;
    const entry = {
      path,
      diff: file,
      additions: file.additions,
      deletions: file.deletions,
      binary: false,
      inPatch: true
    };
    byPath.set(path, entry);
    entries.push(entry);
  }
  for (const file of statFiles ?? []) {
    const path = file.path || "";
    const existing = byPath.get(path);
    if (existing) {
      if (Number.isFinite(file.added)) existing.additions = file.added;
      if (Number.isFinite(file.deleted)) existing.deletions = file.deleted;
      existing.binary = Boolean(file.binary);
      continue;
    }
    const entry = {
      path,
      diff: null,
      additions: Number.isFinite(file.added) ? file.added : 0,
      deletions: Number.isFinite(file.deleted) ? file.deleted : 0,
      binary: Boolean(file.binary),
      inPatch: false
    };
    byPath.set(path, entry);
    entries.push(entry);
  }
  return entries;
}
function parseDiff(patch) {
  const files = [];
  if (typeof patch !== "string" || patch === "") return files;
  let current = null;
  let oldNo = 0;
  let newNo = 0;
  for (const raw of patch.split("\n")) {
    if (raw.startsWith("diff --git ")) {
      const path = parseGitPath(raw);
      current = {
        path,
        language: detectLanguage(path),
        additions: 0,
        deletions: 0,
        lines: []
      };
      files.push(current);
      oldNo = 0;
      newNo = 0;
      continue;
    }
    if (current === null) {
      current = { path: "", language: "text", additions: 0, deletions: 0, lines: [] };
      files.push(current);
    }
    if (raw.startsWith("@@")) {
      const match = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(raw);
      if (match) {
        oldNo = Number(match[1]);
        newNo = Number(match[3]);
      }
      current.lines.push({ type: "hunk", text: raw, oldNo: null, newNo: null });
      continue;
    }
    if (raw.startsWith("+") && !raw.startsWith("+++")) {
      const text = raw.slice(1);
      current.additions += 1;
      current.lines.push({
        type: "add",
        text,
        oldNo: null,
        newNo: newNo++,
        tokens: tokenizeLine(text, current.language)
      });
      continue;
    }
    if (raw.startsWith("-") && !raw.startsWith("---")) {
      const text = raw.slice(1);
      current.deletions += 1;
      current.lines.push({
        type: "del",
        text,
        oldNo: oldNo++,
        newNo: null,
        tokens: tokenizeLine(text, current.language)
      });
      continue;
    }
    if (raw.startsWith(" ")) {
      const text = raw.slice(1);
      current.lines.push({
        type: "context",
        text,
        oldNo: oldNo++,
        newNo: newNo++,
        tokens: tokenizeLine(text, current.language)
      });
      continue;
    }
    if (raw === "") continue;
    current.lines.push({ type: "meta", text: raw, oldNo: null, newNo: null });
  }
  return files;
}

// src/client/index.jsx
var inject = ["slots", "locale", "uiSession"];
var NS = "dshGitTree";
var KIND = "git-graph";
var TAB_ID = "dsh-git-tree";
var API = "api/git-tree";
var WIDGET_MAX_COMMITS = 60;
var DETAIL_MAX_COMMITS = 240;
var GRAPH_INSET = 3;
var MAX_DIFF_ROWS = 4e3;
var en = {
  "tab.title": "Git graph",
  "widget.title": "Git tree",
  "widget.loading": "Reading the Git graph\u2026",
  "widget.noSession": "No active conversation",
  "widget.noSessionHint": "Open a conversation to see its project Git graph.",
  "widget.notRepo": "The working directory is not a Git repository",
  "widget.error": "Could not read the repository",
  "widget.retry": "Retry",
  "widget.refresh": "Refresh",
  "widget.details": "Open details",
  "widget.collapse": "Collapse",
  "widget.expand": "Expand Git tree",
  "widget.detached": "detached HEAD",
  "widget.clean": "clean",
  "widget.changed": "{count} changed",
  "widget.ahead": "{count} ahead",
  "widget.behind": "{count} behind",
  "widget.branches": "{count} branches",
  "widget.commits": "{count} commits",
  "widget.stash": "{count} stashed",
  "widget.hint": "Hover a commit for time, hash and message \xB7 click for details",
  "widget.drag": "Drag to move the Git overlay",
  "widget.loadMore": "Showing the newest {count} commits",
  "detail.title": "Git details",
  "detail.close": "Close",
  "detail.back": "Back to graph",
  "detail.author": "Author",
  "detail.date": "Date",
  "detail.committer": "Committer",
  "detail.hash": "Commit",
  "detail.parents": "Parents",
  "detail.refs": "Refs",
  "detail.stat": "{files} files \xB7 +{insertions} \u2212{deletions}",
  "detail.patch": "Patch",
  "detail.wrap": "Wrap",
  "detail.fileCount": "{count} files",
  "detail.linesTruncated": "Only the first {count} diff lines are rendered.",
  "detail.expandFile": "Show this file's changes",
  "detail.collapseFile": "Hide this file's changes",
  "detail.collapseAll": "Collapse all",
  "detail.binaryFile": "Binary file \u2014 no textual diff.",
  "detail.noFileDiff": "No patch text for this file (possibly cut off by the size limit).",
  "detail.diffError": "Could not load the patch",
  "detail.loading": "Loading\u2026",
  "detail.noDiff": "No textual difference (merge or empty commit).",
  "detail.merge": "merge",
  "detail.root": "Repository",
  "detail.working": "Working tree",
  "detail.branches": "Branches",
  "detail.commits": "History",
  "detail.empty": "No commits yet.",
  "detail.copyHash": "Copy full hash",
  "detail.copied": "Copied",
  "detail.truncated": "Only the newest {count} commits are shown.",
  "detail.filesTruncated": "Only the first {count} changed files are shown.",
  "detail.diffTruncated": "The patch is too large and was cut off.",
  "time.now": "just now",
  "time.minutes": "{count} min ago",
  "time.hours": "{count} h ago",
  "time.days": "{count} d ago"
};
var zh = {
  "tab.title": "Git \u6811",
  "widget.title": "Git \u6811",
  "widget.loading": "\u6B63\u5728\u8BFB\u53D6 Git \u6811\u2026",
  "widget.noSession": "\u5F53\u524D\u6CA1\u6709\u9009\u4E2D\u7684\u4F1A\u8BDD",
  "widget.noSessionHint": "\u6253\u5F00\u4E00\u4E2A\u4F1A\u8BDD\u540E\u663E\u793A\u5176\u9879\u76EE\u7684 Git \u6811\u3002",
  "widget.notRepo": "\u5F53\u524D\u5DE5\u4F5C\u76EE\u5F55\u4E0D\u662F Git \u4ED3\u5E93",
  "widget.error": "\u8BFB\u53D6\u4ED3\u5E93\u5931\u8D25",
  "widget.retry": "\u91CD\u8BD5",
  "widget.refresh": "\u5237\u65B0",
  "widget.details": "\u5C55\u5F00\u8BE6\u60C5",
  "widget.collapse": "\u6536\u8D77",
  "widget.expand": "\u5C55\u5F00 Git \u6811",
  "widget.detached": "\u6E38\u79BB HEAD",
  "widget.clean": "\u5E72\u51C0",
  "widget.changed": "{count} \u5904\u6539\u52A8",
  "widget.ahead": "\u9886\u5148 {count}",
  "widget.behind": "\u843D\u540E {count}",
  "widget.branches": "{count} \u4E2A\u5206\u652F",
  "widget.commits": "{count} \u6B21\u63D0\u4EA4",
  "widget.stash": "{count} \u4E2A\u8D2E\u85CF",
  "widget.hint": "\u60AC\u505C\u67E5\u770B\u63D0\u4EA4\u65F6\u95F4\u3001\u54C8\u5E0C\u4E0E\u63CF\u8FF0 \xB7 \u70B9\u51FB\u5C55\u5F00\u8BE6\u60C5",
  "widget.drag": "\u62D6\u52A8\u60AC\u6D6E\u7A97",
  "widget.loadMore": "\u4EC5\u663E\u793A\u6700\u65B0 {count} \u6B21\u63D0\u4EA4",
  "detail.title": "Git \u8BE6\u60C5",
  "detail.close": "\u5173\u95ED",
  "detail.back": "\u8FD4\u56DE\u56FE\u5F62",
  "detail.author": "\u4F5C\u8005",
  "detail.date": "\u65F6\u95F4",
  "detail.committer": "\u63D0\u4EA4\u8005",
  "detail.hash": "\u63D0\u4EA4",
  "detail.parents": "\u7236\u63D0\u4EA4",
  "detail.refs": "\u5F15\u7528",
  "detail.stat": "{files} \u4E2A\u6587\u4EF6 \xB7 +{insertions} \u2212{deletions}",
  "detail.patch": "\u6539\u52A8",
  "detail.wrap": "\u81EA\u52A8\u6362\u884C",
  "detail.fileCount": "{count} \u4E2A\u6587\u4EF6",
  "detail.linesTruncated": "\u4EC5\u6E32\u67D3\u524D {count} \u884C\u6539\u52A8\u3002",
  "detail.expandFile": "\u5C55\u5F00\u6B64\u6587\u4EF6\u6539\u52A8",
  "detail.collapseFile": "\u6298\u53E0\u6B64\u6587\u4EF6\u6539\u52A8",
  "detail.collapseAll": "\u5168\u90E8\u6298\u53E0",
  "detail.binaryFile": "\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u65E0\u6587\u672C\u6539\u52A8\u3002",
  "detail.noFileDiff": "\u6B64\u6587\u4EF6\u6CA1\u6709 patch \u6587\u672C\uFF08\u53EF\u80FD\u56E0\u6539\u52A8\u8FC7\u5927\u88AB\u622A\u65AD\uFF09\u3002",
  "detail.diffError": "\u6539\u52A8\u52A0\u8F7D\u5931\u8D25",
  "detail.loading": "\u52A0\u8F7D\u4E2D\u2026",
  "detail.noDiff": "\u6CA1\u6709\u6587\u672C\u6539\u52A8\uFF08\u5408\u5E76\u6216\u7A7A\u63D0\u4EA4\uFF09\u3002",
  "detail.merge": "\u5408\u5E76",
  "detail.root": "\u4ED3\u5E93",
  "detail.working": "\u5DE5\u4F5C\u533A",
  "detail.branches": "\u5206\u652F",
  "detail.commits": "\u5386\u53F2",
  "detail.empty": "\u8FD8\u6CA1\u6709\u63D0\u4EA4\u3002",
  "detail.copyHash": "\u590D\u5236\u5B8C\u6574\u54C8\u5E0C",
  "detail.copied": "\u5DF2\u590D\u5236",
  "detail.truncated": "\u4EC5\u663E\u793A\u6700\u65B0 {count} \u6B21\u63D0\u4EA4\u3002",
  "detail.filesTruncated": "\u4EC5\u663E\u793A\u524D {count} \u4E2A\u6539\u52A8\u6587\u4EF6\u3002",
  "detail.diffTruncated": "\u6539\u52A8\u8FC7\u5927\uFF0C\u5DF2\u622A\u65AD\u663E\u793A\u3002",
  "time.now": "\u521A\u521A",
  "time.minutes": "{count} \u5206\u949F\u524D",
  "time.hours": "{count} \u5C0F\u65F6\u524D",
  "time.days": "{count} \u5929\u524D"
};
var MESSAGES = { en, zh };
var detailRequests = {
  latest: null,
  listeners: /* @__PURE__ */ new Set(),
  request(hash) {
    this.latest = hash;
    for (const listener of this.listeners) listener(hash);
  },
  consume() {
    const value = this.latest;
    this.latest = null;
    return value;
  }
};
function useSource(source) {
  const subscribe = (0, import_react.useCallback)((listener) => source.subscribe(listener), [source]);
  const getSnapshot = (0, import_react.useCallback)(() => source.getSnapshot(), [source]);
  return (0, import_react.useSyncExternalStore)(subscribe, getSnapshot);
}
async function callApi(method, params) {
  const response = await fetch(API, {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ method, params })
  });
  if (!response.ok) throw new Error(`git-tree HTTP ${response.status}`);
  const payload = await response.json();
  if (!payload || payload.ok !== true) {
    throw new Error(payload?.error?.message || "git-tree request failed");
  }
  return payload.value;
}
function useSnapshot(sessionId, { max = DETAIL_MAX_COMMITS, intervalMs = 7e3, enabled = true } = {}) {
  const [state, setState] = (0, import_react.useState)({ phase: "loading", snapshot: null, error: null });
  const [revision, setRevision] = (0, import_react.useState)(0);
  const reload = (0, import_react.useCallback)(() => setRevision((value) => value + 1), []);
  (0, import_react.useEffect)(() => {
    if (!sessionId || !enabled) {
      setState({ phase: "idle", snapshot: null, error: null });
      return void 0;
    }
    let active = true;
    let timer = 0;
    const load = async () => {
      try {
        const snapshot = await callApi("snapshot", { sessionId, max });
        if (active) setState({ phase: "ready", snapshot, error: null });
      } catch (error) {
        if (active) {
          setState((previous) => ({
            phase: "error",
            snapshot: previous.snapshot,
            error: error instanceof Error ? error.message : String(error)
          }));
        }
      }
    };
    setState((previous) => ({ phase: previous.snapshot ? "ready" : "loading", snapshot: previous.snapshot, error: null }));
    void load();
    if (intervalMs > 0) {
      timer = window.setInterval(() => {
        if (document.visibilityState === "visible") void load();
      }, intervalMs);
    }
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [sessionId, max, intervalMs, enabled, revision]);
  return [state, reload];
}
var ANCHOR_KEY = "dsh.gitTree.anchor";
var LEGACY_POSITION_KEY = "dsh.gitTree.position";
var CARD_WIDTH = 256;
function readStoredAnchor() {
  try {
    const raw = window.localStorage.getItem(ANCHOR_KEY);
    if (raw) {
      const value = JSON.parse(raw);
      if (value && value.v === 2 && Number.isFinite(value.right) && Number.isFinite(value.top)) {
        return { right: value.right, top: value.top };
      }
    }
    const legacyRaw = window.localStorage.getItem(LEGACY_POSITION_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (legacy && Number.isFinite(legacy.x) && Number.isFinite(legacy.y)) {
        return { legacyX: legacy.x, legacyY: legacy.y };
      }
    }
  } catch {
  }
  return null;
}
function persistAnchor(anchor) {
  try {
    if (anchor === null) {
      window.localStorage.removeItem(ANCHOR_KEY);
      return;
    }
    window.localStorage.setItem(ANCHOR_KEY, JSON.stringify({
      v: 2,
      right: Math.round(anchor.right),
      top: Math.round(anchor.top)
    }));
  } catch {
  }
}
function formatDateTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso || "";
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function formatRelative(iso, tr) {
  const time = new Date(iso).getTime();
  if (!Number.isFinite(time)) return "";
  const delta = Date.now() - time;
  if (delta < 6e4) return tr("time.now");
  if (delta < 36e5) return tr("time.minutes", { count: Math.floor(delta / 6e4) });
  if (delta < 864e5) return tr("time.hours", { count: Math.floor(delta / 36e5) });
  if (delta < 30 * 864e5) return tr("time.days", { count: Math.floor(delta / 864e5) });
  return formatDateTime(iso);
}
function refLabel(ref) {
  return ref.kind === "head" ? ref.name : ref.name;
}
function branchChipClass(branch) {
  return `dshg-chip${branch.current ? " dshg-chip-current" : ""}${branch.remote ? " dshg-chip-remote" : ""}`;
}
function laneColor(index) {
  return LANE_COLORS[index % LANE_COLORS.length];
}
function BranchGlyph() {
  return /* @__PURE__ */ import_react.default.createElement("svg", { viewBox: "0 0 16 16", width: "13", height: "13", "aria-hidden": "true", className: "dshg-glyph" }, /* @__PURE__ */ import_react.default.createElement("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M4 4.2v7.6" }), /* @__PURE__ */ import_react.default.createElement("path", { d: "M12 6.2v1.2c0 1.4-1.1 2.5-2.5 2.5H6.5" })), /* @__PURE__ */ import_react.default.createElement("g", { fill: "currentColor" }, /* @__PURE__ */ import_react.default.createElement("circle", { cx: "4", cy: "3", r: "1.5" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: "4", cy: "13", r: "1.5" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: "12", cy: "4.6", r: "1.5" })));
}
function ExpandGlyph() {
  return /* @__PURE__ */ import_react.default.createElement("svg", { viewBox: "0 0 16 16", width: "13", height: "13", "aria-hidden": "true" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M9.5 3h3.5v3.5M6.5 13H3V9.5M13 3 9 7M3 13l4-4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function RefreshGlyph() {
  return /* @__PURE__ */ import_react.default.createElement("svg", { viewBox: "0 0 16 16", width: "13", height: "13", "aria-hidden": "true" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M13 8a5 5 0 1 1-1.6-3.7M13 3v3h-3", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function ChevronGlyph() {
  return /* @__PURE__ */ import_react.default.createElement("svg", { viewBox: "0 0 16 16", width: "13", height: "13", "aria-hidden": "true" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M10 4 6 8l4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function CaretGlyph() {
  return /* @__PURE__ */ import_react.default.createElement("svg", { viewBox: "0 0 16 16", width: "12", height: "12", "aria-hidden": "true" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M6 4l4 4-4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function DirtyDot({ working, tr }) {
  if (working === void 0 || working === null) return null;
  if (working.clean) {
    return /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-clean", title: tr("widget.clean"), "aria-label": tr("widget.clean") });
  }
  return /* @__PURE__ */ import_react.default.createElement(
    "span",
    {
      className: "dshg-dirty",
      title: `${tr("widget.changed", { count: working.changed })}${working.conflicted > 0 ? " \xB7 conflict" : ""}`,
      "aria-label": tr("widget.changed", { count: working.changed })
    }
  );
}
function RefChips({ refs, tr, limit = 4 }) {
  if (!Array.isArray(refs) || refs.length === 0) return null;
  return /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-refs" }, refs.slice(0, limit).map((ref) => /* @__PURE__ */ import_react.default.createElement("span", { key: `${ref.kind}:${ref.name}`, className: `dshg-ref dshg-ref-${ref.kind}`, title: refLabel(ref) }, refLabel(ref))));
}
function GraphCanvas({ layout, graphWidth, headShort, selected, onSelect, onHover, timeLabel }) {
  const { rows, rowHeight, height } = layout;
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-canvas", style: { height } }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-graph", style: { width: graphWidth, left: GRAPH_INSET } }, /* @__PURE__ */ import_react.default.createElement("svg", { width: graphWidth, height, "aria-hidden": "true" }, rows.map((row) => row.parents.map((parent) => {
    const x1 = laneX(row.lane);
    const y1 = rowY(row.index);
    const x2 = laneX(parent.lane);
    const y2 = parent.row === null ? height - rowHeight / 2 : rowY(parent.row);
    const mid = y1 + (y2 - y1) / 2;
    return /* @__PURE__ */ import_react.default.createElement(
      "path",
      {
        key: `${row.commit.hash}:${parent.hash}`,
        d: `M ${x1} ${y1} C ${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`,
        fill: "none",
        stroke: laneColor(row.lane),
        strokeWidth: "1.6",
        strokeOpacity: "0.85"
      }
    );
  })), rows.map((row) => {
    const isHead = headShort !== "" && (row.commit.short === headShort || row.commit.hash.startsWith(headShort));
    return /* @__PURE__ */ import_react.default.createElement("g", { key: row.commit.hash }, isHead ? /* @__PURE__ */ import_react.default.createElement("circle", { cx: laneX(row.lane), cy: rowY(row.index), r: "5.4", fill: "none", stroke: laneColor(row.lane), strokeWidth: "1.4", strokeOpacity: "0.55" }) : null, /* @__PURE__ */ import_react.default.createElement(
      "circle",
      {
        cx: laneX(row.lane),
        cy: rowY(row.index),
        r: row.commit.parents.length > 1 ? "4.2" : "3.5",
        fill: laneColor(row.lane),
        stroke: "var(--dsw-alias-bg-layer-1, #1b1c1f)",
        strokeWidth: "1.4"
      }
    ));
  }))), rows.map((row) => /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      key: row.commit.hash,
      className: `dshg-row${selected === row.commit.hash ? " dshg-row-selected" : ""}`,
      style: { height: rowHeight, paddingLeft: graphWidth + GRAPH_INSET + 6, lineHeight: `${rowHeight}px` },
      onClick: onSelect ? () => onSelect(row.commit.hash) : void 0,
      onMouseEnter: onHover ? (event) => onHover(row.commit, event) : void 0,
      onMouseLeave: onHover ? () => onHover(null) : void 0,
      role: onSelect ? "button" : void 0,
      tabIndex: onSelect ? 0 : void 0,
      onKeyDown: onSelect ? (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(row.commit.hash);
        }
      } : void 0
    },
    /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-hash" }, row.commit.short),
    /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-subject" }, row.commit.subject || "(no message)"),
    timeLabel ? /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-time" }, timeLabel(row.commit)) : null
  )));
}
function CommitTooltip({ hover, tr }) {
  const commit = hover.commit;
  const width = 320;
  const left = Math.max(8, hover.x - width - 12);
  const top = Math.min(Math.max(8, hover.y - 6), Math.max(8, window.innerHeight - 320));
  const body = (commit.body || "").trim();
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-tooltip", style: { left, top, width }, role: "tooltip" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-tooltip-subject" }, commit.subject || "(no message)"), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-tooltip-meta" }, /* @__PURE__ */ import_react.default.createElement("code", { className: "dshg-tooltip-hash" }, commit.hash.slice(0, 12)), /* @__PURE__ */ import_react.default.createElement("span", null, formatDateTime(commit.date)), /* @__PURE__ */ import_react.default.createElement("span", null, formatRelative(commit.date, tr))), commit.refs.length > 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-tooltip-refs" }, /* @__PURE__ */ import_react.default.createElement(RefChips, { refs: commit.refs, tr, limit: 4 })) : null, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-tooltip-author" }, commit.author, commit.email ? ` <${commit.email}>` : ""), body !== "" ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-tooltip-body" }, body.length > 420 ? `${body.slice(0, 420)}\u2026` : body) : null, commit.parents.length > 1 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-tooltip-merge" }, tr("detail.merge"), " \xB7 ", commit.parents.length, " ", tr("detail.parents")) : null, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-tooltip-hint" }, tr("widget.details"), " \u2192"));
}
function WidgetShell({ children, className = "", style, innerRef, label }) {
  return /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      ref: innerRef,
      style,
      className: `dshg-widget ${className}`,
      role: "complementary",
      "aria-label": label ?? "Git tree"
    },
    children
  );
}
function WidgetBody({ state, snapshot, sessionId, tr, onRetry, children }) {
  if (!sessionId) {
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-title" }, tr("widget.noSession")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, tr("widget.noSessionHint")));
  }
  if (state.phase === "loading" && !snapshot) {
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, tr("widget.loading")));
  }
  if (state.phase === "error" && !snapshot) {
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-title" }, tr("widget.error")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, state.error), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-link", onClick: onRetry }, tr("widget.retry")));
  }
  if (snapshot && snapshot.isRepo === false) {
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-title" }, tr("widget.notRepo")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, snapshot.cwd));
  }
  return children;
}
function GitTreeWidget({ sessionSource, translate, openDetails, getSidebarRight }) {
  const tr = translate;
  const binding = useSource(sessionSource);
  const sessionId = binding?.key;
  const [collapsed, setCollapsed] = (0, import_react.useState)(() => {
    try {
      return window.localStorage.getItem("dsh.gitTree.collapsed") === "1";
    } catch {
      return false;
    }
  });
  const [rightbarOpen, setRightbarOpen] = (0, import_react.useState)(() => {
    try {
      const service = getSidebarRight();
      return Boolean(service && typeof service.isExpanded === "function" && service.isExpanded());
    } catch {
      return false;
    }
  });
  const [fallback, setFallback] = (0, import_react.useState)(false);
  const [hover, setHover] = (0, import_react.useState)(null);
  const listRef = (0, import_react.useRef)(null);
  const [state, reload] = useSnapshot(sessionId, {
    max: WIDGET_MAX_COMMITS,
    intervalMs: 7e3,
    enabled: !rightbarOpen && !fallback
  });
  const snapshot = state.snapshot;
  (0, import_react.useEffect)(() => {
    const read = () => {
      try {
        const service = getSidebarRight();
        setRightbarOpen(Boolean(service && typeof service.isExpanded === "function" && service.isExpanded()));
      } catch {
        setRightbarOpen(false);
      }
    };
    read();
    const timer = window.setInterval(read, 600);
    return () => window.clearInterval(timer);
  }, [getSidebarRight]);
  (0, import_react.useEffect)(() => {
    try {
      window.localStorage.setItem("dsh.gitTree.collapsed", collapsed ? "1" : "0");
    } catch {
    }
  }, [collapsed]);
  const layout = (0, import_react.useMemo)(() => layoutGraph(snapshot?.commits ?? []), [snapshot]);
  const graphWidth = Math.min(layout.laneCount * 12 + 4, 84);
  const branches = (0, import_react.useMemo)(() => {
    const list = snapshot?.branches ?? [];
    return [...list.filter((branch) => !branch.remote), ...list.filter((branch) => branch.remote)];
  }, [snapshot]);
  const handleOpen = (0, import_react.useCallback)((hash) => {
    if (typeof hash === "string" && hash !== "") {
      detailRequests.request(hash);
    }
    if (openDetails()) {
      setRightbarOpen(true);
      return;
    }
    setFallback(true);
  }, [openDetails]);
  const rootRef = (0, import_react.useRef)(null);
  const dragRef = (0, import_react.useRef)(null);
  const storedAnchorRef = (0, import_react.useRef)(void 0);
  const [anchor, setAnchor] = (0, import_react.useState)(() => {
    const stored = readStoredAnchor();
    storedAnchorRef.current = stored;
    return stored && Number.isFinite(stored.right) ? { right: stored.right, top: stored.top } : null;
  });
  const [viewport, setViewport] = (0, import_react.useState)(() => ({ w: window.innerWidth, h: window.innerHeight }));
  (0, import_react.useEffect)(() => {
    let frame = 0;
    const onResize = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setViewport({ w: window.innerWidth, h: window.innerHeight });
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);
  (0, import_react.useEffect)(() => {
    const stored = storedAnchorRef.current;
    storedAnchorRef.current = void 0;
    if (stored && Number.isFinite(stored.legacyX)) {
      const width = rootRef.current?.offsetWidth ?? CARD_WIDTH;
      const right = Math.max(8, window.innerWidth - (stored.legacyX + width));
      const top = Math.max(0, Math.min(stored.legacyY, window.innerHeight - 160));
      const next = { right, top };
      setAnchor(next);
      persistAnchor(next);
      try {
        window.localStorage.removeItem(LEGACY_POSITION_KEY);
      } catch {
      }
    }
  }, []);
  (0, import_react.useEffect)(() => () => {
    document.body.style.userSelect = "";
  }, []);
  const effectiveRight = anchor === null ? null : Math.max(0, Math.min(anchor.right, viewport.w - CARD_WIDTH - 8));
  const effectiveTop = anchor === null ? null : Math.max(0, Math.min(anchor.top, viewport.h - 160));
  const positionStyle = anchor === null ? void 0 : {
    left: "auto",
    right: effectiveRight,
    top: effectiveTop,
    maxHeight: Math.max(140, Math.min(380, viewport.h - effectiveTop - 24))
  };
  const pillStyle = anchor === null ? void 0 : { right: effectiveRight, top: effectiveTop };
  const writeDragFrame = (0, import_react.useCallback)((element, right, top) => {
    const maxRight = Math.max(0, window.innerWidth - CARD_WIDTH - 8);
    const nextRight = Math.max(0, Math.min(Math.round(right), maxRight));
    const nextTop = Math.max(0, Math.min(Math.round(top), Math.max(0, window.innerHeight - 160)));
    element.style.left = "auto";
    element.style.right = `${nextRight}px`;
    element.style.top = `${nextTop}px`;
    element.style.maxHeight = `${Math.max(140, Math.min(380, window.innerHeight - nextTop - 24))}px`;
    return { right: nextRight, top: nextTop };
  }, []);
  const onDragStart = (0, import_react.useCallback)((event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const element = rootRef.current;
    if (element === null) return;
    const rect = element.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      last: writeDragFrame(element, window.innerWidth - (rect.left + rect.width), rect.top)
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
    }
    document.body.style.userSelect = "none";
    event.preventDefault();
  }, [writeDragFrame]);
  const onDragMove = (0, import_react.useCallback)((event) => {
    const drag = dragRef.current;
    if (drag === null || drag.pointerId !== event.pointerId) return;
    const element = rootRef.current;
    if (element === null) return;
    const left = event.clientX - drag.offsetX;
    drag.last = writeDragFrame(element, window.innerWidth - (left + CARD_WIDTH), event.clientY - drag.offsetY);
  }, [writeDragFrame]);
  const onDragEnd = (0, import_react.useCallback)((event) => {
    const drag = dragRef.current;
    if (drag === null) return;
    dragRef.current = null;
    document.body.style.userSelect = "";
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
    }
    if (drag.last) {
      setAnchor(drag.last);
      persistAnchor(drag.last);
    }
  }, []);
  const onDragKeyDown = (0, import_react.useCallback)((event) => {
    const step = event.shiftKey ? 48 : 16;
    const dx = event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0;
    const dy = event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0;
    if (dx === 0 && dy === 0) return;
    event.preventDefault();
    const element = rootRef.current;
    const rect = element?.getBoundingClientRect();
    const base = anchor ?? {
      right: Math.max(0, window.innerWidth - ((rect?.left ?? 0) + (rect?.width ?? CARD_WIDTH))),
      top: Math.max(0, rect?.top ?? 0)
    };
    const next = {
      right: Math.max(0, Math.min(base.right - dx, Math.max(0, window.innerWidth - CARD_WIDTH - 8))),
      top: Math.max(0, Math.min(base.top + dy, Math.max(0, window.innerHeight - 160)))
    };
    setAnchor(next);
    persistAnchor(next);
  }, [anchor]);
  if (fallback) {
    return /* @__PURE__ */ import_react.default.createElement(FallbackDrawer, { sessionId, translate: tr, onClose: () => setFallback(false) });
  }
  if (rightbarOpen) return null;
  if (collapsed) {
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-pill", style: pillStyle, role: "complementary", "aria-label": tr("widget.title") }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-pill-main", onClick: () => setCollapsed(false), title: tr("widget.expand") }, /* @__PURE__ */ import_react.default.createElement(BranchGlyph, null), /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-pill-branch" }, snapshot?.branch && !snapshot.detached ? snapshot.branch : snapshot ? tr("widget.detached") : "\u2026"), /* @__PURE__ */ import_react.default.createElement(DirtyDot, { working: snapshot?.working, tr })), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-iconbtn", onClick: () => handleOpen(), title: tr("widget.details"), "aria-label": tr("widget.details") }, /* @__PURE__ */ import_react.default.createElement(ExpandGlyph, null)));
  }
  return /* @__PURE__ */ import_react.default.createElement(WidgetShell, { innerRef: rootRef, style: positionStyle, label: tr("widget.title") }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-head" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-head-glyph" }, /* @__PURE__ */ import_react.default.createElement(BranchGlyph, null)), /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      type: "button",
      className: "dshg-branch",
      onClick: () => handleOpen(),
      title: `${snapshot?.root ?? ""}${snapshot?.ahead ? ` \xB7 ${tr("widget.ahead", { count: snapshot.ahead })}` : ""}${snapshot?.behind ? ` \xB7 ${tr("widget.behind", { count: snapshot.behind })}` : ""}`
    },
    snapshot ? snapshot.isRepo ? snapshot.detached ? tr("widget.detached") : snapshot.branch : tr("widget.title") : tr("widget.title")
  ), /* @__PURE__ */ import_react.default.createElement(DirtyDot, { working: snapshot?.working, tr }), /* @__PURE__ */ import_react.default.createElement(
    "span",
    {
      className: "dshg-drag",
      role: "button",
      tabIndex: 0,
      "aria-label": tr("widget.drag"),
      title: tr("widget.drag"),
      onPointerDown: onDragStart,
      onPointerMove: onDragMove,
      onPointerUp: onDragEnd,
      onPointerCancel: onDragEnd,
      onKeyDown: onDragKeyDown
    },
    /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-drag-bar", "aria-hidden": "true" })
  ), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-iconbtn", onClick: () => handleOpen(), title: tr("widget.details"), "aria-label": tr("widget.details") }, /* @__PURE__ */ import_react.default.createElement(ExpandGlyph, null)), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-iconbtn", onClick: () => setCollapsed(true), title: tr("widget.collapse"), "aria-label": tr("widget.collapse") }, /* @__PURE__ */ import_react.default.createElement("svg", { viewBox: "0 0 16 16", width: "13", height: "13", "aria-hidden": "true" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "M4 8h8", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })))), /* @__PURE__ */ import_react.default.createElement(WidgetBody, { state, snapshot, sessionId, tr, onRetry: reload }, branches.length > 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-strip", role: "list", "aria-label": tr("detail.branches") }, branches.slice(0, 12).map((branch) => /* @__PURE__ */ import_react.default.createElement("span", { key: branch.ref, className: branchChipClass(branch), role: "listitem", title: `${branch.name}${branch.ahead ? ` \u2191${branch.ahead}` : ""}${branch.behind ? ` \u2193${branch.behind}` : ""}` }, branch.name, branch.ahead ? /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-chip-track" }, "\u2191", branch.ahead) : null, branch.behind ? /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-chip-track" }, "\u2193", branch.behind) : null))) : null, /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      className: "dshg-list",
      ref: listRef,
      onScroll: () => setHover(null)
    },
    layout.rows.length === 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, tr("detail.empty"))) : /* @__PURE__ */ import_react.default.createElement(
      GraphCanvas,
      {
        layout,
        graphWidth,
        headShort: snapshot?.head ?? "",
        onSelect: handleOpen,
        onHover: (commit, event) => {
          if (!commit) {
            setHover(null);
            return;
          }
          const rect = event.currentTarget.getBoundingClientRect();
          setHover({ commit, x: rect.left, y: rect.top });
        }
      }
    )
  ), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-foot" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-foot-text" }, snapshot ? `${tr("widget.branches", { count: snapshot.branches.length })} \xB7 ${tr("widget.commits", { count: snapshot.commits.length })}` : "", snapshot?.working && !snapshot.working.clean ? ` \xB7 ${tr("widget.changed", { count: snapshot.working.changed })}` : "", snapshot?.stash ? ` \xB7 ${tr("widget.stash", { count: snapshot.stash })}` : ""), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-iconbtn", onClick: reload, title: tr("widget.refresh"), "aria-label": tr("widget.refresh") }, /* @__PURE__ */ import_react.default.createElement(RefreshGlyph, null)))), hover ? /* @__PURE__ */ import_react.default.createElement(CommitTooltip, { hover, tr }) : null);
}
function DiffTokens({ tokens }) {
  if (!tokens || tokens.length === 0) return null;
  return tokens.map((token, index) => token.kind === "plain" ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, { key: index }, token.text) : /* @__PURE__ */ import_react.default.createElement("span", { key: index, className: `dshg-tok-${token.kind}` }, token.text));
}
function DiffLine({ line }) {
  if (line.type === "hunk") {
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-diff-line dshg-diff-hunk" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-diff-text" }, line.text));
  }
  if (line.type === "meta") {
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-diff-line dshg-diff-meta" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-diff-text" }, line.text));
  }
  const mark = line.type === "add" ? "+" : line.type === "del" ? "\u2212" : " ";
  return /* @__PURE__ */ import_react.default.createElement("div", { className: `dshg-diff-line dshg-diff-${line.type}` }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-diff-gutter" }, line.oldNo ?? ""), /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-diff-gutter" }, line.newNo ?? ""), /* @__PURE__ */ import_react.default.createElement("span", { className: `dshg-diff-mark dshg-diff-mark-${line.type}` }, mark), /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-diff-text" }, /* @__PURE__ */ import_react.default.createElement(DiffTokens, { tokens: line.tokens })));
}
function DiffView({ files, emptyLabel, limitLabel, showFileHeader = true }) {
  const rows = (0, import_react.useMemo)(() => {
    const flat = [];
    files.forEach((file, fileIndex) => {
      if (showFileHeader) flat.push({ kind: "file", file, fileIndex });
      file.lines.forEach((line, lineIndex) => {
        flat.push({ kind: "line", line, key: `${fileIndex}:${lineIndex}` });
      });
    });
    return flat;
  }, [files, showFileHeader]);
  if (files.length === 0) return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, emptyLabel);
  const visible = rows.length > MAX_DIFF_ROWS ? rows.slice(0, MAX_DIFF_ROWS) : rows;
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-diff" }, visible.map((row) => row.kind === "file" ? /* @__PURE__ */ import_react.default.createElement("div", { key: `file-${row.fileIndex}`, className: "dshg-diff-file", "data-diff-path": row.file.path }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-diff-file-path", title: row.file.path }, row.file.path || "\u2014"), /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-diff-file-stat" }, /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-add" }, "+", row.file.additions), /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-del" }, "\u2212", row.file.deletions))) : /* @__PURE__ */ import_react.default.createElement(DiffLine, { key: row.key, line: row.line })), rows.length > MAX_DIFF_ROWS ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-diff-note" }, limitLabel) : null);
}
function GitDetails({ sessionId, translate }) {
  const tr = translate;
  const [state, reload] = useSnapshot(sessionId, { max: DETAIL_MAX_COMMITS, intervalMs: 1e4 });
  const snapshot = state.snapshot;
  const [selected, setSelected] = (0, import_react.useState)(null);
  const [detail, setDetail] = (0, import_react.useState)({ phase: "idle", value: null, error: null });
  const [diff, setDiff] = (0, import_react.useState)({ phase: "idle", value: null, error: null });
  const [copied, setCopied] = (0, import_react.useState)(false);
  const [wrap, setWrap] = (0, import_react.useState)(false);
  const [expandedFiles, setExpandedFiles] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
  const layout = (0, import_react.useMemo)(() => layoutGraph(snapshot?.commits ?? []), [snapshot]);
  const graphWidth = Math.min(layout.laneCount * 12 + 4, 150);
  const selectedCommit = (0, import_react.useMemo)(
    () => (snapshot?.commits ?? []).find((commit) => commit.hash === selected) ?? null,
    [snapshot, selected]
  );
  const patchText = diff.phase === "ready" && diff.value ? diff.value.patch : "";
  const diffFiles = (0, import_react.useMemo)(() => parseDiff(patchText), [patchText]);
  const fileEntries = (0, import_react.useMemo)(
    () => mergeFileEntries(diffFiles, detail.value?.files),
    [diffFiles, detail.value]
  );
  const diffAdditions = (0, import_react.useMemo)(
    () => diffFiles.reduce((total, file) => total + file.additions, 0),
    [diffFiles]
  );
  const diffDeletions = (0, import_react.useMemo)(
    () => diffFiles.reduce((total, file) => total + file.deletions, 0),
    [diffFiles]
  );
  (0, import_react.useEffect)(() => {
    const pending = detailRequests.consume();
    if (pending) setSelected(pending);
    const listener = (hash) => setSelected(hash);
    detailRequests.listeners.add(listener);
    return () => {
      detailRequests.listeners.delete(listener);
    };
  }, []);
  (0, import_react.useEffect)(() => {
    if (!sessionId || !selected) {
      setDetail({ phase: "idle", value: null, error: null });
      setDiff({ phase: "idle", value: null, error: null });
      return void 0;
    }
    let active = true;
    setDetail({ phase: "loading", value: null, error: null });
    setDiff({ phase: "loading", value: null, error: null });
    setExpandedFiles(/* @__PURE__ */ new Set());
    callApi("commit", { sessionId, hash: selected }).then((value) => {
      if (active) setDetail({ phase: "ready", value, error: null });
    }).catch((error) => {
      if (active) setDetail({ phase: "error", value: null, error: error.message });
    });
    callApi("diff", { sessionId, hash: selected }).then((value) => {
      if (active) setDiff({ phase: "ready", value, error: null });
    }).catch((error) => {
      if (active) setDiff({ phase: "error", value: null, error: error.message });
    });
    return () => {
      active = false;
    };
  }, [sessionId, selected]);
  const toggleFile = (0, import_react.useCallback)((path) => {
    if (!path) return;
    setExpandedFiles((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);
  const collapseAll = (0, import_react.useCallback)(() => setExpandedFiles(/* @__PURE__ */ new Set()), []);
  const copyHash = (0, import_react.useCallback)(() => {
    if (!selected) return;
    try {
      void navigator.clipboard?.writeText(selected);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
    }
  }, [selected]);
  if (!sessionId) {
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail dshg-empty" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, tr("widget.noSession")));
  }
  if (selected) {
    const value = detail.value;
    const commit = selectedCommit;
    const subject = value?.subject ?? commit?.subject ?? "";
    const fullHash = value?.hash ?? selected;
    const shortHash = value?.short ?? commit?.short ?? selected.slice(0, 7);
    const body = value?.body ?? commit?.body ?? "";
    const files = value?.files ?? [];
    const isMerge = (value?.parents?.length ?? commit?.parents?.length ?? 0) > 1;
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail-head dshg-detail-head-commit" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-back", onClick: () => setSelected(null) }, /* @__PURE__ */ import_react.default.createElement(ChevronGlyph, null), " ", tr("detail.back")), /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-commit-short" }, shortHash), /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-head-spacer" }), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-iconbtn", onClick: reload, title: tr("widget.refresh"), "aria-label": tr("widget.refresh") }, /* @__PURE__ */ import_react.default.createElement(RefreshGlyph, null))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail-body" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail-info" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "dshg-commit-title" }, subject), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-commit-tags" }, isMerge ? /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-tag dshg-tag-merge" }, tr("detail.merge")) : null, value ? /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-tag" }, tr("detail.stat", { files: files.length, insertions: value.insertions, deletions: value.deletions })) : null), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-commit-meta" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-kv" }, /* @__PURE__ */ import_react.default.createElement("span", null, tr("detail.hash")), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-hashbtn", onClick: copyHash, title: tr("detail.copyHash") }, copied ? tr("detail.copied") : fullHash)), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-kv" }, /* @__PURE__ */ import_react.default.createElement("span", null, tr("detail.author")), /* @__PURE__ */ import_react.default.createElement("b", null, value?.author ?? commit?.author ?? "")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-kv" }, /* @__PURE__ */ import_react.default.createElement("span", null, tr("detail.date")), /* @__PURE__ */ import_react.default.createElement("b", null, formatDateTime(value?.date ?? commit?.date ?? ""))), value?.committer && value.committer !== value.author ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-kv" }, /* @__PURE__ */ import_react.default.createElement("span", null, tr("detail.committer")), /* @__PURE__ */ import_react.default.createElement("b", null, value.committer)) : null, commit?.refs?.length > 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-kv" }, /* @__PURE__ */ import_react.default.createElement("span", null, tr("detail.refs")), /* @__PURE__ */ import_react.default.createElement(RefChips, { refs: commit.refs, tr, limit: 6 })) : null, value?.parents?.length > 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-kv" }, /* @__PURE__ */ import_react.default.createElement("span", null, tr("detail.parents")), /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-parents" }, value.parents.map((hash) => /* @__PURE__ */ import_react.default.createElement("code", { key: hash }, hash.slice(0, 7))))) : null), detail.phase === "loading" ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, tr("detail.loading")) : null, detail.phase === "error" ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-error" }, detail.error) : null, body ? /* @__PURE__ */ import_react.default.createElement("pre", { className: "dshg-commit-body" }, body) : null), /* @__PURE__ */ import_react.default.createElement("section", { className: "dshg-detail-diff", "aria-label": tr("detail.patch") }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-code-toolbar" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-code-title" }, tr("detail.patch")), diff.phase === "ready" ? /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-code-stat" }, /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-add" }, "+", value?.insertions ?? diffAdditions), /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-del" }, "\u2212", value?.deletions ?? diffDeletions)) : null, fileEntries.length > 0 ? /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-code-count" }, tr("detail.fileCount", { count: fileEntries.length })) : null, /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-head-spacer" }), expandedFiles.size > 0 ? /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-textbtn", onClick: collapseAll }, tr("detail.collapseAll")) : null, /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        type: "button",
        className: `dshg-wrapbtn${wrap ? " dshg-wrapbtn-on" : ""}`,
        "aria-pressed": wrap,
        onClick: () => setWrap((current) => !current)
      },
      tr("detail.wrap")
    )), diff.phase === "loading" ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, tr("detail.loading")) : null, diff.phase === "error" ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-error" }, tr("detail.diffError"), ": ", diff.error) : null, fileEntries.length === 0 && diff.phase === "ready" ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, tr("detail.noDiff")) : /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-file-list" }, fileEntries.map((entry) => {
      const entryKey = entry.path || "__unnamed__";
      const open = expandedFiles.has(entryKey);
      return /* @__PURE__ */ import_react.default.createElement("section", { key: entryKey, className: "dshg-file-entry" }, /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          type: "button",
          className: "dshg-file-row",
          "aria-expanded": open,
          onClick: () => toggleFile(entryKey),
          title: open ? tr("detail.collapseFile") : tr("detail.expandFile")
        },
        /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-file-caret", "aria-hidden": "true" }, /* @__PURE__ */ import_react.default.createElement(CaretGlyph, null)),
        /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-file-path" }, entry.path || "\u2014"),
        /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-file-stat" }, entry.binary ? "bin" : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-add" }, "+", entry.additions), /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-del" }, "\u2212", entry.deletions)))
      ), open ? /* @__PURE__ */ import_react.default.createElement("div", { className: `dshg-file-diff${wrap ? " dshg-diff-wrap" : ""}` }, entry.diff ? /* @__PURE__ */ import_react.default.createElement(
        DiffView,
        {
          files: [entry.diff],
          showFileHeader: false,
          emptyLabel: tr("detail.noDiff"),
          limitLabel: tr("detail.linesTruncated", { count: MAX_DIFF_ROWS })
        }
      ) : /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, entry.binary ? tr("detail.binaryFile") : tr("detail.noFileDiff"))) : null);
    })), value?.filesTruncated ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-diff-note" }, tr("detail.filesTruncated", { count: files.length })) : null, diff.phase === "ready" && diff.value?.truncated ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-diff-note" }, tr("detail.diffTruncated")) : null)));
  }
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail-head" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-head-glyph" }, /* @__PURE__ */ import_react.default.createElement(BranchGlyph, null)), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail-repo" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail-name" }, snapshot?.name ?? tr("detail.title")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail-path", title: snapshot?.root ?? "" }, snapshot?.root ?? "")), /* @__PURE__ */ import_react.default.createElement(DirtyDot, { working: snapshot?.working, tr }), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-iconbtn", onClick: reload, title: tr("widget.refresh"), "aria-label": tr("widget.refresh") }, /* @__PURE__ */ import_react.default.createElement(RefreshGlyph, null))), state.phase === "error" && !snapshot ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-title" }, tr("widget.error")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, state.error), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-link", onClick: reload }, tr("widget.retry"))) : null, state.phase !== "error" && !snapshot && state.phase !== "idle" ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, tr("widget.loading"))) : null, snapshot && snapshot.isRepo === false ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-title" }, tr("widget.notRepo")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, snapshot.cwd)) : null, snapshot && snapshot.isRepo ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-summary" }, /* @__PURE__ */ import_react.default.createElement("span", { className: snapshot.detached ? "dshg-summary-detached" : "" }, snapshot.detached ? tr("widget.detached") : snapshot.branch), snapshot.ahead ? /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-chip-track" }, tr("widget.ahead", { count: snapshot.ahead })) : null, snapshot.behind ? /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-chip-track" }, tr("widget.behind", { count: snapshot.behind })) : null, /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-head-spacer" }), /* @__PURE__ */ import_react.default.createElement("span", { className: "dshg-summary-work" }, snapshot.working.clean ? tr("widget.clean") : tr("widget.changed", { count: snapshot.working.changed }))), snapshot.branches.length > 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-strip dshg-strip-wide", role: "list", "aria-label": tr("detail.branches") }, snapshot.branches.map((branch) => /* @__PURE__ */ import_react.default.createElement("span", { key: branch.ref, className: branchChipClass(branch), role: "listitem", title: `${branch.name}${branch.upstream ? ` \u2192 ${branch.upstream}` : ""}` }, branch.name, branch.gone ? /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-chip-track" }, "gone") : null, branch.ahead ? /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-chip-track" }, "\u2191", branch.ahead) : null, branch.behind ? /* @__PURE__ */ import_react.default.createElement("em", { className: "dshg-chip-track" }, "\u2193", branch.behind) : null))) : null, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail-list" }, layout.rows.length === 0 ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-empty-hint" }, tr("detail.empty"))) : /* @__PURE__ */ import_react.default.createElement(
    GraphCanvas,
    {
      layout,
      graphWidth,
      headShort: snapshot.head,
      selected,
      onSelect: setSelected,
      timeLabel: (commit) => formatRelative(commit.date, tr)
    }
  )), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-detail-foot" }, snapshot.truncated ? tr("detail.truncated", { count: snapshot.commits.length }) : "")) : null);
}
function FallbackDrawer({ sessionId, translate, onClose }) {
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-drawer", role: "dialog", "aria-label": translate("detail.title") }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-drawer-head" }, /* @__PURE__ */ import_react.default.createElement("span", null, translate("detail.title")), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dshg-iconbtn", onClick: onClose, "aria-label": translate("detail.close") }, "\u2715")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dshg-drawer-body" }, /* @__PURE__ */ import_react.default.createElement(GitDetails, { sessionId, translate })));
}
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, MESSAGES), "dsh-git-tree: locale dictionaries");
  const translate = ctx.locale.bind(NS);
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.dshGitTree = "true";
    style.textContent = styles_default;
    document.head.append(style);
    return () => style.remove();
  }, "dsh-git-tree: styles");
  const fallbackSessionSource = {
    subscribe: () => () => {
    },
    getSnapshot: () => ({ key: void 0 })
  };
  const sessionSource = ctx.uiSession?.adapter?.current ?? fallbackSessionSource;
  const getSidebarRight = () => {
    try {
      return ctx.get("sidebarRight");
    } catch {
      return void 0;
    }
  };
  const openDetails = () => {
    const service = getSidebarRight();
    if (!service || typeof service.openTab !== "function") return false;
    try {
      service.openTab(KIND);
      return true;
    } catch (error) {
      console.warn("[dsh-git-tree] could not open the right Sidebar tab", error);
      return false;
    }
  };
  ctx.inject(["sidebarRightTabs"], (scoped) => {
    scoped.effect(() => {
      try {
        return scoped.sidebarRightTabs.register({
          id: TAB_ID,
          kind: KIND,
          title: () => translate("tab.title"),
          keepMounted: true
        });
      } catch (error) {
        console.warn("[dsh-git-tree] tab type registration failed", error);
        return void 0;
      }
    }, "dsh-git-tree: right Sidebar tab type");
  });
  ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
    name: "sidebar.right.pane.tab",
    key: TAB_ID,
    inject: () => ({ translate })
  }, GitDetails));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "git-tree-widget",
    order: 20,
    inject: () => ({ translate, sessionSource, openDetails, getSidebarRight })
  }, GitTreeWidget));
}
return module.exports;}});
