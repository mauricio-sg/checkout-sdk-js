import { ScriptLoader } from '@bigcommerce/script-loader';

import { PaymentMethodClientUnavailableError } from '../../errors';
import PaymentMethod from '../../payment-method';

import { AmazonPayV2HostWindow, AmazonPayV2Regions, AmazonPayV2SDK } from './amazon-pay-v2';

function isAmazonPayV2Region(region: string): region is keyof typeof AmazonPayV2Regions {
    return Object.keys(AmazonPayV2Regions).indexOf(region) !== -1;
}

export default class AmazonPayV2ScriptLoader {
    constructor(
        private _scriptLoader: ScriptLoader,
        private _window: AmazonPayV2HostWindow = window
    ) {}

    async load(method: PaymentMethod): Promise<AmazonPayV2SDK> {
        const {
            initializationData: { region = 'us' } = {},
        } = method;

        const amazonPayV2Region: AmazonPayV2Regions = isAmazonPayV2Region(region)
            ? AmazonPayV2Regions[region]
            : AmazonPayV2Regions.us;

        await this._scriptLoader.loadScript(`https://static-${amazonPayV2Region}.payments-amazon.com/checkout.js`);

        if (!this._window.amazon) {
            throw new PaymentMethodClientUnavailableError();
        }

        return this._window.amazon;
    }
}
