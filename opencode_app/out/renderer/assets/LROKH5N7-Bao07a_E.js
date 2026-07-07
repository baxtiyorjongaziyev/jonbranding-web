!(function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {};
    e.SENTRY_RELEASE = { id: "desktop@1.17.13" };
  } catch (e2) {
  }
})();
;
{
  try {
    (function() {
      var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {}, n = new e.Error().stack;
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "6564f748-0020-47b7-b3f4-bb6846c816d2", e._sentryDebugIdIdentifier = "sentry-dbid-6564f748-0020-47b7-b3f4-bb6846c816d2");
    })();
  } catch (e) {
  }
}
;
import { aE as createUniqueId, a_ as mergeDefaultProps, bq as splitProps, k as FORM_CONTROL_PROP_NAMES, aB as createSignal, ap as createFormControl, aD as createToggleState, ar as createFormResetListener, au as createMemo, al as createComponent, P as Polymorphic, a$ as mergeProps, a8 as access, b0 as mergeRefs, n as FormControlContext, bG as useFormControlContext, q as FormControlLabel, F as FORM_CONTROL_FIELD_PROP_NAMES, aq as createFormControlField, ak as combineStyle, c4 as visuallyHiddenStyles, p as FormControlErrorMessage, o as FormControlDescription, am as createContext, as as createGenerateId, ag as children, aW as isFunction, aZ as memo, af as callHandler, bC as useContext, E as EventKey, a5 as __export } from "./main-Do1GNfcH.js";
var switch_exports = {};
__export(switch_exports, {
  Control: () => SwitchControl,
  Description: () => SwitchDescription,
  ErrorMessage: () => SwitchErrorMessage,
  Input: () => SwitchInput,
  Label: () => SwitchLabel,
  Root: () => SwitchRoot,
  Switch: () => Switch,
  Thumb: () => SwitchThumb,
  useSwitchContext: () => useSwitchContext
});
var SwitchContext = createContext();
function useSwitchContext() {
  const context = useContext(SwitchContext);
  if (context === void 0) {
    throw new Error("[kobalte]: `useSwitchContext` must be used within a `Switch` component");
  }
  return context;
}
function SwitchControl(props) {
  const formControlContext = useFormControlContext();
  const context = useSwitchContext();
  const mergedProps = mergeDefaultProps({
    id: context.generateId("control")
  }, props);
  const [local, others] = splitProps(mergedProps, ["onClick", "onKeyDown"]);
  const onClick = (e) => {
    callHandler(e, local.onClick);
    context.toggle();
    context.inputRef()?.focus();
  };
  const onKeyDown = (e) => {
    callHandler(e, local.onKeyDown);
    if (e.key === EventKey.Space) {
      context.toggle();
      context.inputRef()?.focus();
    }
  };
  return createComponent(Polymorphic, mergeProps({
    as: "div",
    onClick,
    onKeyDown
  }, () => formControlContext.dataset(), () => context.dataset(), others));
}
function SwitchDescription(props) {
  const context = useSwitchContext();
  return createComponent(FormControlDescription, mergeProps(() => context.dataset(), props));
}
function SwitchErrorMessage(props) {
  const context = useSwitchContext();
  return createComponent(FormControlErrorMessage, mergeProps(() => context.dataset(), props));
}
function SwitchInput(props) {
  const formControlContext = useFormControlContext();
  const context = useSwitchContext();
  const mergedProps = mergeDefaultProps({
    id: context.generateId("input")
  }, props);
  const [local, formControlFieldProps, others] = splitProps(mergedProps, ["ref", "style", "onChange", "onFocus", "onBlur"], FORM_CONTROL_FIELD_PROP_NAMES);
  const {
    fieldProps
  } = createFormControlField(formControlFieldProps);
  const onChange = (e) => {
    callHandler(e, local.onChange);
    e.stopPropagation();
    const target = e.target;
    context.setIsChecked(target.checked);
    target.checked = context.checked();
  };
  const onFocus = (e) => {
    callHandler(e, local.onFocus);
    context.setIsFocused(true);
  };
  const onBlur = (e) => {
    callHandler(e, local.onBlur);
    context.setIsFocused(false);
  };
  return createComponent(Polymorphic, mergeProps({
    as: "input",
    ref(r$) {
      var _ref$ = mergeRefs(context.setInputRef, local.ref);
      typeof _ref$ === "function" && _ref$(r$);
    },
    type: "checkbox",
    role: "switch",
    get id() {
      return fieldProps.id();
    },
    get name() {
      return formControlContext.name();
    },
    get value() {
      return context.value();
    },
    get checked() {
      return context.checked();
    },
    get required() {
      return formControlContext.isRequired();
    },
    get disabled() {
      return formControlContext.isDisabled();
    },
    get readonly() {
      return formControlContext.isReadOnly();
    },
    get style() {
      return combineStyle({
        ...visuallyHiddenStyles
      }, local.style);
    },
    get ["aria-checked"]() {
      return context.checked();
    },
    get ["aria-label"]() {
      return fieldProps.ariaLabel();
    },
    get ["aria-labelledby"]() {
      return fieldProps.ariaLabelledBy();
    },
    get ["aria-describedby"]() {
      return fieldProps.ariaDescribedBy();
    },
    get ["aria-invalid"]() {
      return formControlContext.validationState() === "invalid" || void 0;
    },
    get ["aria-required"]() {
      return formControlContext.isRequired() || void 0;
    },
    get ["aria-disabled"]() {
      return formControlContext.isDisabled() || void 0;
    },
    get ["aria-readonly"]() {
      return formControlContext.isReadOnly() || void 0;
    },
    onChange,
    onFocus,
    onBlur
  }, () => formControlContext.dataset(), () => context.dataset(), others));
}
function SwitchLabel(props) {
  const context = useSwitchContext();
  return createComponent(FormControlLabel, mergeProps(() => context.dataset(), props));
}
function SwitchRoot(props) {
  let ref;
  const defaultId = `switch-${createUniqueId()}`;
  const mergedProps = mergeDefaultProps({
    value: "on",
    id: defaultId
  }, props);
  const [local, formControlProps, others] = splitProps(mergedProps, ["ref", "children", "value", "checked", "defaultChecked", "onChange", "onPointerDown"], FORM_CONTROL_PROP_NAMES);
  const [inputRef, setInputRef] = createSignal();
  const [isFocused, setIsFocused] = createSignal(false);
  const {
    formControlContext
  } = createFormControl(formControlProps);
  const state = createToggleState({
    isSelected: () => local.checked,
    defaultIsSelected: () => local.defaultChecked,
    onSelectedChange: (selected) => local.onChange?.(selected),
    isDisabled: () => formControlContext.isDisabled(),
    isReadOnly: () => formControlContext.isReadOnly()
  });
  createFormResetListener(() => ref, () => state.setIsSelected(local.defaultChecked ?? false));
  const onPointerDown = (e) => {
    callHandler(e, local.onPointerDown);
    if (isFocused()) {
      e.preventDefault();
    }
  };
  const dataset = createMemo(() => ({
    "data-checked": state.isSelected() ? "" : void 0
  }));
  const context = {
    value: () => local.value,
    dataset,
    checked: () => state.isSelected(),
    inputRef,
    generateId: createGenerateId(() => access(formControlProps.id)),
    toggle: () => state.toggle(),
    setIsChecked: (isChecked) => state.setIsSelected(isChecked),
    setIsFocused,
    setInputRef
  };
  return createComponent(FormControlContext.Provider, {
    value: formControlContext,
    get children() {
      return createComponent(SwitchContext.Provider, {
        value: context,
        get children() {
          return createComponent(Polymorphic, mergeProps({
            as: "div",
            ref(r$) {
              var _ref$2 = mergeRefs((el) => ref = el, local.ref);
              typeof _ref$2 === "function" && _ref$2(r$);
            },
            role: "group",
            get id() {
              return access(formControlProps.id);
            },
            onPointerDown
          }, () => formControlContext.dataset(), dataset, others, {
            get children() {
              return createComponent(SwitchRootChild, {
                state: context,
                get children() {
                  return local.children;
                }
              });
            }
          }));
        }
      });
    }
  });
}
function SwitchRootChild(props) {
  const resolvedChildren = children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });
  return memo(resolvedChildren);
}
function SwitchThumb(props) {
  const formControlContext = useFormControlContext();
  const context = useSwitchContext();
  const mergedProps = mergeDefaultProps({
    id: context.generateId("thumb")
  }, props);
  return createComponent(Polymorphic, mergeProps({
    as: "div"
  }, () => formControlContext.dataset(), () => context.dataset(), mergedProps));
}
var Switch = Object.assign(SwitchRoot, {
  Control: SwitchControl,
  Description: SwitchDescription,
  ErrorMessage: SwitchErrorMessage,
  Input: SwitchInput,
  Label: SwitchLabel,
  Thumb: SwitchThumb
});
export {
  Switch as S
};
//# sourceMappingURL=LROKH5N7-Bao07a_E.js.map
