import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../pq2/compendium-routing.module';
import { FusionDataService } from '../pq2/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { PQCompendiumModule } from '../pq2/pq-compendium.module';
import { CompendiumConfig } from '../pq2/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_UNLOCKS_JSON from './data/demon-unlocks.json';
import DEMON_DATA_JSON from '../p3/data/van-demon-data.json';
import SKILL_DATA_JSON from '../p3/data/van-skill-data.json';
import ENEMY_DATA_JSON from '../p3/data/van-enemy-data.json';
import FUSION_CHART_JSON from '../p3/data/van-fusion-chart.json';
import SPECIAL_RECIPES_JSON from '../p3/data/van-special-recipes.json';
import FUSION_PREREQS_JSON from '../p3/data/van-fusion-prereqs.json';

function createCompConfig(): CompendiumConfig {
  const resistElems = COMP_CONFIG_JSON.resistElems;
  const skillElems = resistElems.concat(COMP_CONFIG_JSON.skillElems);
  const races = [];
  const inheritTypes: { [elem: string]: number } = {};

  for(const race of COMP_CONFIG_JSON.races) {
    races.push(race);
    races.push(race + ' P');
  }

  const COST_HP = 2 << 10;
  const COST_MP = 3 << 10;
  const COST_MP_PER = 4 << 10;

  for (const entry of Object.values(SKILL_DATA_JSON)) {
    if (entry['cost'] < 2000) {
      const cost = entry['cost'];
      const costType = cost > 100 ? (cost > 1000 ? COST_MP - 1000 : COST_MP_PER - 100) : COST_HP;
      entry['cost'] = cost ? cost + costType: 0;
    }
  }

  for (const [name, prereq] of Object.entries(FUSION_PREREQS_JSON)) {
    DEMON_DATA_JSON[name]['prereq'] = prereq;
  }

  for (const [elem, inherits] of Object.entries(COMP_CONFIG_JSON.inheritTypes)) {
    inheritTypes[elem] = parseInt(inherits, 2);
  }

  return {
    appTitle: 'Persona 3 Reload',
    races,
    raceOrder: races.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    appCssClasses: ['p3r'],

    skillData: SKILL_DATA_JSON,
    skillElems,
    ailmentElems: COMP_CONFIG_JSON.ailments.map(x => x.slice(0, 3)),
    elemOrder: skillElems.reduce((acc, x, i) => { acc[x] = i; return acc }, {}),
    resistCodes: COMP_CONFIG_JSON.resistCodes,

    demonData: DEMON_DATA_JSON,
    baseStats: COMP_CONFIG_JSON.baseStats,
    resistElems,
    inheritTypes,
    inheritElems: COMP_CONFIG_JSON.inheritElems,

    demonUnlocks: DEMON_UNLOCKS_JSON,
    enemyData: ENEMY_DATA_JSON,
    enemyStats: ['HP', 'MP'].concat(COMP_CONFIG_JSON.baseStats),

    normalTable: FUSION_CHART_JSON,
    hasTripleFusion: false,
    hasDemonResists: true,
    hasEnemies: true,
    hasQrcodes: false,
    specialRecipes: SPECIAL_RECIPES_JSON,

    settingsKey: 'p3r-fusion-tool-settings',
    settingsVersion: 2401131500
  };
}

const SMT_COMP_CONFIG = createCompConfig();

@NgModule({
  imports: [
    CommonModule,
    PQCompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }],
  ]
})
export class CompendiumModule { }
