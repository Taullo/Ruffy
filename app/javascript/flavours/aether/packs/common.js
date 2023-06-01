import 'packs/public-path';
import { start } from '@rails/ujs';

start();

import 'flavours/aether/styles/index.scss';

//  This ensures that webpack compiles our images.
require.context('../images', true);
