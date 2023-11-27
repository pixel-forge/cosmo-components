import * as React from 'react';
import {Cosmo_SyncComponent} from '../base/Cosmo_SyncComponent';
import {_className, _keys} from '@pixel-forge/cosmo-utils';
import './Cosmo_DevManager.scss';
import {devManager_dark, devManager_light} from './themes';
import {CosmoModule_DevManager} from '../../modules/CosmoModule_DevManager';
import {CosmoIcons} from '@pixel-forge/cosmo-icons';

export type CosmoDevPageProp = { key: string, label: string, page: React.ElementType }
type LabelsMap = { [k: string]: string };
type PageMap = { [k: string]: React.ElementType };

type Props = {
	devPages: CosmoDevPageProp[]
	headerTailRenderer?: (updateCallback: () => void) => React.ReactNode;
};

type State = {
	labelsMap: LabelsMap;
	pageMap: PageMap;
	selectedPage?: string;
};

export class Cosmo_DevManager
	extends Cosmo_SyncComponent<Props, State> {

	// ################## Class Properties ##################

	static themes = {
		light: devManager_light,
		dark: devManager_dark,
	};

	// ################## Class Lifecycle ##################

	protected deriveStateFromProps(nextProps: Props, state: State) {
		state.labelsMap = nextProps.devPages.reduce((map, page) => {
			map[page.key] = page.label;
			return map;
		}, {} as LabelsMap);

		state.pageMap = nextProps.devPages.reduce((map, page) => {
			map[page.key] = page.page;
			return map;
		}, {} as PageMap);

		state.selectedPage = CosmoModule_DevManager.getSelectedKey();
		if (!_keys(state.labelsMap).includes(state.selectedPage)) {
			delete state.selectedPage;
			CosmoModule_DevManager.resetSelectedKey();
		}
		return state;
	}

	// ################## Class Logic ##################

	private setSelectedPage = (key: string) => {
		CosmoModule_DevManager.setSelectedKey(key);
		this.setState({selectedPage: key});
	};

	private toggleCollapse = () => {
		CosmoModule_DevManager.setPanelCollapse(!CosmoModule_DevManager.getPanelCollapse());
		this.forceUpdate();
	};

	// ################## Class Rendering ##################

	private renderHeader = () => {
		const iconClass = _className(
			'cosmo-dev-manager__header__collapse-icon',
			!CosmoModule_DevManager.getPanelCollapse() && 'open',
		);
		return <div className={'cosmo-dev-manager__header'}>
			<CosmoIcons.menu.regular
				className={iconClass}
				onClick={this.toggleCollapse}
			/>
			<div className={'cosmo-dev-manager__header__title'}>Cosmo Dev Manager</div>
			{this.props.headerTailRenderer && this.props.headerTailRenderer(() => this.forceUpdate())}
		</div>;
	};

	private renderBody = () => {
		return <div className={'cosmo-dev-manager__body'}>
			{this.renderPageList()}
			{this.renderPageContent()}
		</div>;
	};

	private renderPageList = () => {
		const className = _className(
			'cosmo-dev-manager__page-list',
			CosmoModule_DevManager.getPanelCollapse() && 'collapsed',
		);
		return <div className={className}>
			{_keys(this.state.labelsMap).map(key => {
				const className = _className(
					'cosmo-dev-manager__page-list__item',
					key === this.state.selectedPage && 'selected'
				);
				return <div
					key={key}
					className={className}
					onClick={() => this.setSelectedPage(key as string)}
				>{this.state.labelsMap[key]}</div>;
			})}
		</div>;
	};

	private renderPageContent = () => {
		if (!this.state.selectedPage)
			return;

		const Page = this.state.pageMap[this.state.selectedPage];
		if (!Page)
			return;

		return <Page/>;
	};

	render() {
		return <div className={'cosmo-dev-manager'}>
			{this.renderHeader()}
			{this.renderBody()}
		</div>;
	}
}