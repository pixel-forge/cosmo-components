import * as React from 'react';
import {Cosmo_SyncComponent} from '../../base/Cosmo_SyncComponent';
import {_className} from '@pixel-forge/cosmo-utils';
import './Cosmo_Input.scss';
import {input_darkTheme, input_lightTheme} from './themes';
import {CosmoIcons} from '@pixel-forge/cosmo-icons';

type InputVariant = 'normal' | 'search' | string;

type Props_Base = {
	style?: React.CSSProperties;
	className?: string;
	id?: string;
	disabled?: boolean;
	placeholder?: string;
	onClear?: (e: React.MouseEvent<HTMLDivElement>) => void;
	variant: InputVariant
};

type Props_NumberInput = {
	type: 'number';
	value?: number;
	onChange: (value?: number) => void;
	onAccept?: (value?: number) => void;
}

type Props_TextInput = {
	type: 'text';
	value?: string;
	onChange: (value?: string) => void;
	onAccept?: (value?: string) => void;
}

type Props = Props_Base & (Props_TextInput | Props_NumberInput);

type State = {
	value?: string | number;
};

export class Cosmo_Input
	extends Cosmo_SyncComponent<Props, State> {

	// ################## Class Properties ##################

	static themes = {
		light: input_lightTheme,
		dark: input_darkTheme,
	};

	static defaultProps: Partial<Props> = {
		variant: 'normal',
	};

	private readonly inputRef = React.createRef<HTMLInputElement>();

	// ################## Class Life Cycle ##################

	protected deriveStateFromProps(nextProps: Props, state: Partial<State>): State {
		state.value = nextProps.value;
		return state as State;
	}

	// ################## Class Logic ##################

	private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.stopPropagation();
			e.preventDefault();
			this.onAccept();
		}
	};

	private onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const resolvedValue = this.props.type === 'text'
			? (value === '' ? undefined : value)
			: (value === '' ? undefined : Number(value));

		//@ts-ignore
		this.props.onChange(resolvedValue);
	};

	private onClear = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		this.props.onClear?.(e);
	};

	private onAccept = () => {
		//@ts-ignore
		this.props.onAccept?.(this.state.value);
		this.inputRef.current?.blur();
	};

	private focusInput = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.stopPropagation();
		e.preventDefault();
		this.inputRef.current?.focus();
	};

	// ################## Class Render ##################

	private renderInput = () => {
		return <input
			id={this.props.id}
			type={this.props.type}
			value={this.props.value ?? ''}
			onChange={this.onValueChange}
			disabled={this.props.disabled}
			placeholder={this.props.placeholder}
			onKeyDown={this.onKeyDown}
			ref={this.inputRef}
		/>;
	};

	private renderClearButton = () => {
		if (!this.props.onClear)
			return;

		return <CosmoIcons.x.regular
			className={'cosmo-input__clear'}
			onClick={this.onClear}
		/>;
	};

	private renderSearch = () => {
		if (this.props.variant !== 'search')
			return;

		return <CosmoIcons.search.regular
			className={'cosmo-input__search'}
			onClick={e => {
				e.stopPropagation();
				e.preventDefault();
				this.onAccept();
			}}
		/>;
	};

	render() {
		const className = _className('cosmo-input', this.props.className);
		return <div
			className={className}
			onClick={this.focusInput}
			data-variant={this.props.variant}
		>
			{this.renderInput()}
			{this.renderClearButton()}
			{this.renderSearch()}
		</div>;
	}
}