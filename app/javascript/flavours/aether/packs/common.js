import 'packs/public-path';
import { start } from '@rails/ujs';
import 'flavours/aether/styles/index.scss';

start();

//  This ensures that webpack compiles our images.
require.context('../images', true);
