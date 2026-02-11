/*
 * Copyright (c) 2026, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

export enum DblParameter {
  AggressivenessBreakfast = 'MEAL_RATIO_BREAKFAST_FACTOR',
  AggressivenessDinner = 'MEAL_RATIO_DINNER_FACTOR',
  AggressivenessLunch = 'MEAL_RATIO_LUNCH_FACTOR',
  AggressivenessHyperglycemia = 'BOLUS_AGGRESSIVENESS_FACTOR',
  AggressivenessNormoglycemia = 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
  AverageBreakfast = 'MEDIUM_MEAL_BREAKFAST',
  AverageDinner = 'MEDIUM_MEAL_DINNER',
  AverageLunch = 'MEDIUM_MEAL_LUNCH',
  Height = 'HEIGHT',
  HyperglycemiaThreshold = 'PATIENT_GLY_HYPER_LIMIT',
  HypoglycemiaThreshold = 'PATIENT_GLY_HYPO_LIMIT',
  // Insulin type from DBLG2
  InsulinType = 'INSULIN_TYPE',
  // Insulin type from DBLG1
  InsulinTypeUsed = 'INSULIN_TYPE_USED',
  LargeBreakfast = 'LARGE_MEAL_BREAKFAST',
  LargeDinner = 'LARGE_MEAL_DINNER',
  LargeLunch = 'LARGE_MEAL_LUNCH',
  SmallBreakfast = 'SMALL_MEAL_BREAKFAST',
  SmallDinner = 'SMALL_MEAL_DINNER',
  SmallLunch = 'SMALL_MEAL_LUNCH',
  TargetGlucoseLevel = 'PATIENT_GLYCEMIA_TARGET',
  TotalDailyInsulin = 'TOTAL_INSULIN_FOR_24H',
  Weight = 'WEIGHT',
}
