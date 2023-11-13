import * as React from 'react';
import {Cosmo_SyncComponent} from '../../base/Cosmo_SyncComponent';
import { _className } from '@pixel-forge/cosmo-utils';

type Props_Base = {
	style?: React.CSSProperties;
	className?: string;
	id?:string;
	disabled?:boolean;
};

type Props_NumberInput = Props_Base & {
	type: 'number';
	value: number | undefined;
	onChange: (value: string) => void;
}

type Props_TextInput = Props_Base & {
	type: 'text';
	value: string | undefined;
	onChange: (value: string) => void;
}

type Props = Props_NumberInput | Props_TextInput;

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
		this.props.onChange(value);
	}

	// ################## Class Render ##################

	render () {
		const className = _className('cosmo-input',this.props.className);
		return <input
			id={this.props.id}
			type={this.props.type}
			value={this.props.value}
			onChange={this.onValueChange}
			className={className}
			disabled={this.props.disabled}
		/>
	}
}