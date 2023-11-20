import * as React from 'react';
import {Cosmo_SyncComponent} from '../../base/Cosmo_SyncComponent';
import './Cosmo_Button.scss';
import {_className} from '@pixel-forge/cosmo-utils';

type ButtonVariant = 'normal' | 'submit' | 'cancel';

type Props = React.PropsWithChildren<{
	id?: string;
	className?: string;
	onClick: (e: React.MouseEvent<HTMLDivElement>) => (void | Promise<void>);
	variant: ButtonVariant;
	loaderRenderer: () => React.ReactNode;
	disabled?: boolean;
}>;

type State = {
	isAsync: boolean;
	actionInProgress: boolean;
	disabled: boolean;
};

export class Cosmo_Button
	extends Cosmo_SyncComponent<Props, State> {

	// ################## Class Properties ##################

	static defaultProps: Partial<Props> = {
		variant: 'normal',
		loaderRenderer: Cosmo_Button.loaderRenderer,
	};

	// ################## Class Life Cycle ##################

	protected deriveStateFromProps(nextProps: Props, state: Partial<State>): State {
		state.isAsync = nextProps.onClick.constructor.name === 'AsyncFunction';
		state.disabled = nextProps.disabled ?? false;
		state.actionInProgress ??= false;
		return state as State;
	}

	// ################## Class Logic ##################

	private onClick = async (e: React.MouseEvent<HTMLDivElement>) => {
		this.logVerbose('Button Clicked');
		//Stop the event from doing anything other than the function
		e.stopPropagation();
		e.preventDefault();

		if (this.props.disabled)
			return this.logVerbose('Button disabled, aborting');

		if (this.state.actionInProgress)
			return this.logVerboseBold('Action already in progress, aborting');

		if (!this.state.isAsync)
			return this.triggerSyncCallback(e);

		await this.triggerAsyncCallback(e);
	};

	private triggerSyncCallback = (e: React.MouseEvent<HTMLDivElement>) => {
		this.logVerbose('Calling synchronous callback');
		this.props.onClick(e);
	};

	private triggerAsyncCallback = async (e: React.MouseEvent<HTMLDivElement>) => {
		this.logVerbose('Calling asynchronous callback');
		this.setState(
			{actionInProgress: true},
			async () => {
				try {
					await this.props.onClick(e);
					this.logVerbose('Action finished successfully');
				} catch (e) {
					this.logError('Action failed', e as Error);
				} finally {
					this.setState({actionInProgress: false});
				}
			}
		);
	};

	// ################## Class Render ##################

	static loaderRenderer() {
		return <div className={'cosmo-button__loader'}/>;
	}

	render() {
		const className = _className('cosmo-button', this.props.className);
		return <div
			id={this.props.id}
			className={className}
			onClick={this.onClick}
			data-variant={this.props.variant}
			data-disabled={this.props.disabled}
		>
			{this.state.actionInProgress && this.props.loaderRenderer()}
			{!this.state.actionInProgress && this.props.children}
		</div>;
	}
}