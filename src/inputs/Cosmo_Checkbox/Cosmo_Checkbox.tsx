import * as React from 'react';
import {Cosmo_SyncComponent} from '../../base/Cosmo_SyncComponent';
import './Cosmo_Checkbox.scss';
import {_className} from '@pixel-forge/cosmo-utils';
import {CosmoIcons} from '@pixel-forge/cosmo-icons';

type Props = React.PropsWithChildren<{
	//Core functionality
	checked?: boolean;
	onCheck: (checked: boolean, e: React.MouseEvent<HTMLDivElement>) => void;
	disabled?: boolean;
	label?: string;

	//Design
	id?: string;
	className?: string;
	buttonIcon?: React.JSX.Element;
}>;

type State = {
	checked: boolean;
	disabled: boolean;
};

export class Cosmo_Checkbox
	extends Cosmo_SyncComponent<Props, State> {

	// ################## Class Life Cycle ##################

	protected deriveStateFromProps(nextProps: Props, state: Partial<State>): State {
		state.checked = nextProps.checked ?? false;
		state.disabled = nextProps.disabled ?? false;
		return state as State;
	}

	// ################## Class Logic ##################

	private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const checkStatus = !this.state.checked;
		this.props.onCheck(checkStatus, e);
	};

	// ################## Class Render ##################

	private renderButtonIcon = (): React.ReactElement => {
		if (this.props.buttonIcon)
			return this.props.buttonIcon;

		return <CosmoIcons.v.regular/>;
	};

	private renderCheckButton = () => {
		return <div className={'cosmo-checkbox__button'}>
			{this.renderButtonIcon()}
		</div>;
	};

	private renderContent = () => {
		if (this.props.label)
			return <div className={'cosmo-checkbox__label'}>{this.props.label}</div>;

		return this.props.children;
	};

	render() {
		const className = _className('cosmo-checkbox', this.props.className);
		return <div
			id={this.props.id}
			className={className}
			onClick={this.onClick}
			data-checked={this.state.checked}
			data-disabled={this.props.disabled}
		>
			{this.renderCheckButton()}
			{this.renderContent()}
		</div>;
	}
}