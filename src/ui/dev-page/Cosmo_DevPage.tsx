import * as React from 'react';
import {Cosmo_SyncComponent} from '../base/Cosmo_SyncComponent';
import './Cosmo_DevPage.scss';

export abstract class Cosmo_DevPage<State>
	extends Cosmo_SyncComponent<{}, State> {

	// ################## Class Rendering - Abstract ##################

	protected abstract renderHeaderContent: () => React.ReactNode;

	protected abstract renderBodyContent: () => React.ReactNode;

	// ################## Class Rendering ##################

	private renderHeader = () => {
		return <div className={'cosmo-dev-page__header'}>
			{this.renderHeaderContent()}
		</div>;
	};

	private renderBody = () => {
		return <div className={'cosmo-dev-page__body'}>
			{this.renderBodyContent()}
		</div>;
	};

	render() {
		return <div className={'cosmo-dev-page'}>
			{this.renderHeader()}
			{this.renderBody()}
		</div>;
	}
}