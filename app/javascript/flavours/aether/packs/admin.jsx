import 'packs/public-path';
import { createRoot } from 'react-dom/client';

import ready from 'flavours/aether/ready';

ready(() => {
  [].forEach.call(document.querySelectorAll('[data-admin-component]'), element => {
    const componentName  = element.getAttribute('data-admin-component');
    const { ...componentProps } = JSON.parse(element.getAttribute('data-props'));

    import('flavours/aether/containers/admin_component').then(({ default: AdminComponent }) => {
      return import('flavours/aether/components/admin/' + componentName).then(({ default: Component }) => {
        const root = createRoot(element);

        root.render (
          <AdminComponent>
            <Component {...componentProps} />
          </AdminComponent>,
        );
      });
    }).catch(error => {
      console.error(error);
    });
  });
});
