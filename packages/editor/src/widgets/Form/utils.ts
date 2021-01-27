import { FirstParameter, MaterialsForms, Maybe } from 'types';
import { registerFormFields } from './Fields';
import { FormProps } from './types';

export function initMaterialsForms(forms: Maybe<MaterialsForms>) {
  if (forms?.fields) {
    debugger;
    registerFormFields(
      forms.fields.reduce<FirstParameter<typeof registerFormFields>>((accu, { field, component }) => {
        accu[field] = component as React.ComponentType<FormProps<object>>;
        return accu;
      }, {}),
    );
  }
}
