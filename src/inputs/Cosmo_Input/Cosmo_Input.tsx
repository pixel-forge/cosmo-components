import * as React from 'react';
import {Cosmo_SyncComponent} from '../../base/Cosmo_SyncComponent';
import {_className} from '@pixel-forge/cosmo-utils';
import './Cosmo_Input.scss';

type Props_Base = {
	style?: React.CSSProperties;
	className?: string;
	id?: string;
	disabled?: boolean;
	placeholder?: string;
};

type Props_NumberInput = {
	type: 'number';
	value?: number;
	onChange: (value?: number) => void;
}

type Props_TextInput = {
	type: 'text';
	value?: string;
	onChange: (value?: string) => void;
}

type Props = Props_Base & (Props_TextInput | Props_NumberInput);

type State = {
	value?: string | number;
};

export class Cosmo_Input
	extends Cosmo_SyncComponent<Props, State> {

	// ################## Class Life Cycle ##################

	protected deriveStateFromProps(nextProps: Props, state: Partial<State>): State {
		state.value = nextProps.value;
		return state as State;
	}

	// ################## Class Logic ##################

	private onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const resolvedValue = this.props.type === 'text'
			? (value === '' ? undefined : value)
			: (value === '' ? undefined : Number(value));

		//@ts-ignore
		this.props.onChange(resolvedValue);
	};

	// ################## Class Render ##################

	render() {
		const className = _className('cosmo-input', this.props.className);
		return <input
			id={this.props.id}
			type={this.props.type}
			value={this.props.value ?? ''}
			onChange={this.onValueChange}
			className={className}
			disabled={this.props.disabled}
			placeholder={this.props.placeholder}
		/>;
	}
}