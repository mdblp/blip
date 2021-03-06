/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import schema from './validator/schematron.js';

const wizard = (common) => {
  return schema(
    common,
    {
      deviceTime: schema().ifExists().isDeviceTime(),
      recommended: schema().ifExists().object({
        carb: schema().ifExists().number(),
        correction: schema().ifExists().number()
      }),
      bgInput: schema().ifExists().number(),
      carbInput: schema().ifExists().number(),
      insulinOnBoard: schema().ifExists().number(),
      insulinCarbRatio: schema().ifExists().number(),
      insulinSensitivity: schema().ifExists().number(),
      bgTarget: schema().ifExists().oneOf(
        // Medtronic
        schema(
            {
              low: schema().number(),
              high: schema().number(),
              range: schema().banned(),
              target: schema().banned()
            }
        ),
        // Animas
        schema(
            {
              target: schema().number(),
              range: schema().number(),
              low: schema().banned(),
              high: schema().banned()
            }
        ),
        // OmniPod
        schema(
            {
              target: schema().number(),
              high: schema().number(),
              low: schema().banned(),
              range: schema().banned()
            }
        ),
        // Tandem
        schema(
            {
              target: schema().number(),
              low: schema().banned(),
              high: schema().banned(),
              range: schema().banned()
            }
        )
      ),
      bolus: schema().ifExists().object()
    }
  );
};

export default wizard;
