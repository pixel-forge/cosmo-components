import * as React from 'react';
import {Cosmo_SyncComponent} from '../../base/Cosmo_SyncComponent';
import {_className} from '@pixel-forge/cosmo-utils';
import './Cosmo_Radio.scss';
import {radio_darkTheme, radio_lightTheme} from './themes';

type RadioVariants = 'normal' | 'label';

type Props_CanUnselect<T> = {
	canUnselect: true;
	onSelect: (selected?: T, prevValue?: T) => void;
}

type Props_CanNotUnselect<T> = {
	canUnselect: false;
	onSelect: (selected: T, prevValue?: T) => void;
}

type Props_Base<T> = {
	values: T[];
	groupName: string;
	selected?: T;
	disabled?: boolean;
	className?: string;
	variant: RadioVariants | string;
	labelRenderer?: (value: T) => React.ReactNode
	buttonRenderer?: (value: T, selected: boolean) => React.ReactNode
}

type Props<T> = Props_Base<T> & (Props_CanUnselect<T> | Props_CanNotUnselect<T>);

type State<T> = {
	values: T[];
	selected?: T;
	disabled?: boolean;
};

export class Cosmo_Radio<T>
	extends Cosmo_SyncComponent<Props<T>, State<T>> {

	// ################## Class Properties ##################

	static themes = {
		light: radio_lightTheme,
		dark: radio_darkTheme,
	}

	static defaultProps: Partial<Props<any>> = {
		variant: 'normal',
		canUnselect: false
	};

	// ################## Class Life Cycle ##################

	protected deriveStateFromProps(nextProps: Props<T>, state: State<T>) {
		state.values = nextProps.values;
		state.selected = nextProps.selected;
		state.disabled = nextProps.disabled;
		return state;
	}

	// ################## Class Logic ##################

	private onSelect = (_value: T) => {
		let value: T | undefined = undefined;

		//If clicking the same value
		if (_value === this.state.selected) {
			if (!this.props.canUnselect)
				return;
		} else { //Clicking different value
			value = _value;
		}

		this.props.onSelect(value as T, this.state.selected);
	};

	// ################## Class Render ##################

	private renderOption = (value: T) => {
		if (this.props.labelRenderer)
			return this.props.labelRenderer(value);

		const selected = this.state.selected === value;
		const className = _className('cosmo-radio__option', selected && 'selected');
		return <label className={className} key={`${this.props.groupName}-${value}`}>
			{this.renderInput(value)}
			{this.renderButton(value)}
			{this.renderLabel(value)}
		</label>;
	};

	private renderInput = (value: T) => {
		return <input
			type="radio"
			className={'cosmo-radio__input'}
			disabled={this.state.disabled}
			checked={this.state.selected === value}
			onChange={() => this.onSelect(value)}
			name={this.props.groupName}
		/>;
	};

	private renderLabel = (value: T) => {
		const content = this.props.labelRenderer?.(value) ?? String(value);
		return <div className={'cosmo-radio__label'}>{content}</div>;
	};

	private renderButton = (value: T) => {
		const selected = this.state.selected === value;
		return this.props.buttonRenderer?.(value, selected) ?? <div className={'cosmo-radio__button'}/>;
	};

	render() {
		const className = _className(
			'cosmo-radio',
			this.props.disabled && 'disabled',
			this.props.className
		);

		return <div className={className} data-variant={this.props.variant}>
			{this.state.values.map(value => this.renderOption(value))}
		</div>;
	}
}