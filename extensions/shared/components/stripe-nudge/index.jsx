/**
 * External dependencies
 */
import GridiconStar from 'gridicons/dist/star';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { Warning } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import analytics from '../../../../_inc/client/lib/analytics';

import './style.scss';

export const StripeNudge = ( { autosaveAndRedirectToStripeConnect, stripeConnectUrl } ) => (
	<Warning
		actions={
			// Use stripeConnectUrl to determine whether or not to display the Connect button.
			// We tried setting autosaveAndRedirectToStripeConnect to falsey in `withDispatch`,
			// but it doesn't seem to be reliably updated after a `withSelect` update.
			stripeConnectUrl && [
				<Button
					href={ stripeConnectUrl } // Only for server-side rendering, since onClick doesn't work there.
					onClick={ autosaveAndRedirectToStripeConnect }
					target="_top"
					isDefault
				>
					{ __( 'Connect', 'jetpack' ) }
				</Button>,
			]
		}
		className="jetpack-stripe-nudge"
	>
		<span className="jetpack-stripe-nudge__info">
			<GridiconStar
				className="jetpack-stripe-nudge__icon"
				size={ 18 }
				aria-hidden="true"
				role="img"
				focusable="false"
			/>
			<span className="jetpack-stripe-nudge__text-container">
				<span className="jetpack-stripe-nudge__title">
					{ __( 'To use this block, connect to Stripe.', 'jetpack' ) }
				</span>
				<span className="jetpack-stripe-nudge__message">
					{ __(
						'Check if Stripe is available in your country, and sign up for an account.',
						'jetpack'
					) }
				</span>
			</span>
		</span>
	</Warning>
);

export default compose( [
	withDispatch( ( dispatch, { blockName, stripeConnectUrl } ) => ( {
		autosaveAndRedirectToStripeConnect: async event => {
			event.preventDefault(); // Don't follow the href before autosaving
			analytics.tracks.recordEvent( 'jetpack_editor_block_stripe_connect_click', {
				block: blockName,
			} );
			await dispatch( 'core/editor' ).autosave();
			// Using window.top to escape from the editor iframe on WordPress.com
			window.top.location.href = stripeConnectUrl;
		},
	} ) ),
] )( StripeNudge );
