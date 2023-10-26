import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from './compendium-routing.module';
import { FusionDataService } from './fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE } from '../compendium/constants';
import { P5CompendiumModule } from './p5-compendium.module';
import { CompendiumConfig } from './models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import INHERIT_TYPES_JSON from './data/inheritance-types.json';

import DEMON_DATA_JSON from './data/demon-data.json';
import DLC_DATA_JSON from './data/dlc-data.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import ENEMY_DATA_JSON from './data/enemy-data.json';
import PARTY_DATA_JSON from './data/party-data.json';

import SPECIAL_RECIPES_JSON from './data/special-recipes.json';
import FUSION_PREREQS_JSON from './data/fusion-prereqs.json';
import FUSION_CHART_JSON from './data/fusion-chart.json';
import ELEMENT_CHART_JSON from './data/element-chart.json';

const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
const inheritTypes: { [elem: string]: number } = {};
const races = [];

for(const race of COMP_CONFIG_JSON.races) {
  races.push(race);
  races.push(race + ' P');
}

for (let i = 0; i < INHERIT_TYPES_JSON.inherits.length; i++) {
  inheritTypes[INHERIT_TYPES_JSON.inherits[i]] = parseInt(INHERIT_TYPES_JSON.ratios[i], 2);
}

for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
  DEMON_DATA_JSON[name].prereq = prereq;
}

for (const entry of Object.values(SKILL_DATA_JSON)) {
  if (entry['effect'].includes('power') && !entry['effect'].includes('√')) {
    entry['effect'] = '√' + entry['effect'];
  }
}

export const compendiumConfig: CompendiumConfig = {
  appTitle: 'Persona 5',

  races,
  raceOrder: COMP_CONFIG_JSON.races.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
  baseStats: COMP_CONFIG_JSON.baseStats,
  skillElems,
  resistElems: COMP_CONFIG_JSON.resistElems,
  resistCodes: COMP_CONFIG_JSON.resistCodes,
  elemOrder: skillElems.reduce((acc, t, i) => { acc[t] = i; return acc }, {}),
  inheritTypes,
  inheritElems: INHERIT_TYPES_JSON.elems,

  enemyStats: ['HP', 'MP'],
  enemyResists: COMP_CONFIG_JSON.resistElems,

  demonData: [DEMON_DATA_JSON, DLC_DATA_JSON, PARTY_DATA_JSON],
  skillData: [SKILL_DATA_JSON],
  enemyData: [ENEMY_DATA_JSON],

  normalTable: FUSION_CHART_JSON,
  elementTable: ELEMENT_CHART_JSON,
  specialRecipes: SPECIAL_RECIPES_JSON,

  dlcDemons: COMP_CONFIG_JSON.dlcDemons,
  downloadedDemons: [],
  settingsKey: 'p5-fusion-tool-settings',
  settingsVersion: 1709211400
};

@NgModule({
  imports: [
    CommonModule,
    P5CompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: compendiumConfig }]
  ]
})
export class CompendiumModule { }
