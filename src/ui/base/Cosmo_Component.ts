import * as React from 'react';
import {_keys, Cosmo_Logger, Cosmo_LogLevel, Cosmo_LogParam, sortArray} from '@pixel-forge/cosmo-utils';

let componentInstances: number = 0;

export abstract class Cosmo_Component<Props = {}, State = {}>
	extends React.Component<Props, State> {

	// ################## Class Properties ##################

	private logger: Cosmo_Logger;
	private minLogLevel: Cosmo_LogLevel = Cosmo_LogLevel.Info;
	protected mounted: boolean = false;

	// ################## Class Init ##################

	constructor(props:Props) {
		super(props);
		const tag = `${this.constructor['name']}-${++componentInstances}`;
		this.logger = new Cosmo_Logger(tag);
		this.logger.setMinLevel(this.minLogLevel);
		this._deriveStateFromProps.bind(this);
		this.state = this._deriveStateFromProps(props,{})

		//Rewrite componentDidMount
		const __componentDidMount = this.componentDidMount?.bind(this);
		this.componentDidMount = () => {
			this.mounted = true;
			__componentDidMount?.();
		};
	}

	// ################## Class Life Cycle ##################

	//Inheriting classes will have to implement this wrapper function for deriveStateFromProps
	protected abstract _deriveStateFromProps(nextProps: Props, state: Partial<State>): State;

	UNSAFE_componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
		//If props haven't changed, abort
		if(!this.shouldReDeriveState(nextProps))
			return;
		
		//Calculate new state and set it
		const currentState = this.state ? {...this.state} : {} as State;
		const state = this._deriveStateFromProps(nextProps,currentState);
		this.setState(state);
	}

	//A better version for comparing the current state with the next state
	shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
		const currentStateKeys = sortArray(_keys(this.state));
		const nextStateKeys = sortArray(_keys(nextState));

		//Yes if not the same amount of keys
		if(currentStateKeys.length !== nextStateKeys.length)
			return true;

		//Yes if keys or content mismatch
		if(currentStateKeys.some((key,index)=> {
			return currentStateKeys[index] !== nextStateKeys[index]
			|| this.state[key] !== nextState[key];
		}))
			return true

		return false;
	}

	//Added step for checking if the props have changed
	shouldReDeriveState(nextProps:Readonly<Props>) {
		const currentPropsKeys = sortArray(_keys(this.props));
		const nextPropsKeys = sortArray(_keys(nextProps));

		//Yes if not the same amount of keys
		if(currentPropsKeys.length !== nextPropsKeys.length)
			return true;

		//Yes if keys or content mismatch
		if(currentPropsKeys.some((key,index)=> {
			return currentPropsKeys[index] !== nextPropsKeys[index]
				|| this.props[key] !== nextProps[key];
		}))
			return true

		return false;
	}

	// ################## Class Methods ##################

	protected setLoggerMinLevel = (logLevel: Cosmo_LogLevel) => {
		this.logger.setMinLevel(logLevel);
	}

	// ################## Class Methods - Logging ##################

	logVerbose = (...toLog: Cosmo_LogParam[]) => {
		this.logger.log(Cosmo_LogLevel.Verbose, false, toLog);
	};

	logVerboseBold = (...toLog: Cosmo_LogParam[]) => {
		this.logger.log(Cosmo_LogLevel.Verbose, true, toLog);
	};

	logDebug = (...toLog: Cosmo_LogParam[]) => {
		this.logger.log(Cosmo_LogLevel.Debug, false, toLog);
	};

	logDebugBold = (...toLog: Cosmo_LogParam[]) => {
		this.logger.log(Cosmo_LogLevel.Debug, true, toLog);
	};

	logInfo = (...toLog: Cosmo_LogParam[]) => {
		this.logger.log(Cosmo_LogLevel.Info, false, toLog);
	};

	logInfoBold = (...toLog: Cosmo_LogParam[]) => {
		this.logger.log(Cosmo_LogLevel.Info, true, toLog);
	};

	logWarning = (...toLog: Cosmo_LogParam[]) => {
		this.logger.log(Cosmo_LogLevel.Warning, false, toLog);
	};

	logWarningBold = (...toLog: Cosmo_LogParam[]) => {
		this.logger.log(Cosmo_LogLevel.Warning, true, toLog);
	};

	logError = (...toLog: Cosmo_LogParam[]) => {
		this.logger.log(Cosmo_LogLevel.Error, false, toLog);
	};

	logErrorBold = (...toLog: Cosmo_LogParam[]) => {
		this.logger.log(Cosmo_LogLevel.Error, true, toLog);
	};
}