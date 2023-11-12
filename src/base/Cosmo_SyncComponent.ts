import {Cosmo_Component} from './Cosmo_Component';

export abstract class Cosmo_SyncComponent<Props = {}, State = {}>
	extends Cosmo_Component<Props,State> {

	protected abstract deriveStateFromProps(nextProps: Props, state: Partial<State>): State;

	protected _deriveStateFromProps(nextProps: Props, state: Partial<State>): State {
		const _state = this.deriveStateFromProps(nextProps,state);
		this.setState(_state);
		return _state;
	}
}