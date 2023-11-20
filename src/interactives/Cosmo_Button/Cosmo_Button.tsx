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

		this.logVerbose('Calling callback');
		const returnValue = this.props.onClick(e);
		const isPromise: boolean = !!(returnValue as Promise<void>)?.then;
		if (!isPromise) {
			this.logVerbose('Sync callback finished successfully');
			return;
		}

		this.setState(
			{actionInProgress: true},
			() => {
				(returnValue as Promise<void>).then(() => {
					this.logVerbose('Async callback finished successfully');
				}).catch((e) => {
					this.logError('Async callback returned error', e as Error);
				}).finally(() => {
					this.setState({actionInProgress: false});
				});
			}
		);
	};

	// ################## Class Render ##################

	static loaderRenderer() {
		return <div className={'cosmo-button__loader'}/>;
	}

	render() {
		const className = _className(
			'cosmo-button',
			this.props.className,
			this.state.actionInProgress && 'in-progress'
		);

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