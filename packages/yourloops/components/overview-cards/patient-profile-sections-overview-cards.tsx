import { useTranslation } from 'react-i18next'
import { GenericListCard } from '../generic-list-card/generic-list-card'
import React, { type FC, useMemo } from 'react'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { DblParameter, DiabeticType, Unit } from 'medical-domain'
import { ViewMoreLink } from '../buttons/view-more-link'
import { useAuth } from '../../lib/auth'
import { cardStyle } from './card-style'
import Typography from '@mui/material/Typography'
import { Patient } from '../../lib/patient/models/patient.model'
import {
  getPatientDisplayInfo
} from '../../pages/patient-view/patient-profile/sections/personal-information/patient-personal-information.util'
import { formatNumberForLang } from '../../lib/language'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { formatDateWithMomentShortFormatWithoutHours } from '../../lib/utils'
import { useLocation } from 'react-router-dom'

interface PatientProfileSectionsOverviewCardsProps {
  patient: Patient
}

export const PatientProfileSectionsOverviewCards: FC<PatientProfileSectionsOverviewCardsProps> = ({ patient }: PatientProfileSectionsOverviewCardsProps) => {
  const { t } = useTranslation()
  const { classes: { cards, cardsHeader } } = cardStyle()
  const { user } = useAuth()
  const userBgUnit = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter
  const patientInfo = useMemo(() => getPatientDisplayInfo(patient), [patient])
  const { pathname } = useLocation()
  const urlPrefix = pathname.substring(0, pathname.lastIndexOf('/'))

  const formattedDate =
    formatDateWithMomentShortFormatWithoutHours(
      new Date(patientInfo.equipmentDate),
      t('short-date')
    )

  const isNA = (formattedString : string): boolean => !formattedString || /n\/?a/i.test(formattedString)

  const getTableProfileInformation = (): { value: string, label: string }[] => {

    return [
      { label: t('age'), value: isNA(patientInfo.age) ? '' : patientInfo.age },
      { label: t(`params|${DblParameter.Weight}`), value: isNA(formatNumberForLang(patientInfo.weight)) ? '' : formatNumberForLang(patientInfo.weight) },
      { label: t(`params|${DblParameter.Height}`), value: isNA(formatNumberForLang(patientInfo.height)) ? '' :formatNumberForLang(patientInfo.height) },
      { label: t('equipment-date'), value: isNA(formattedDate) ? '' : formattedDate },
      { label: t(`params|${DblParameter.InsulinType}`), value: isNA(patientInfo.insulinType) ? '' :  patientInfo.insulinType }
    ]
  }

  const getTableLeadCliniciansInformation = (): { value: string, label: string }[] => {
    return [
      { label: t('lead-clinicians-count'), value: `${patient.leadClinicians.length}` }
    ]
  }

  const getChipConfig = (type: DiabeticType): string => {
    switch (type) {
      case DiabeticType.DT1DT2:
        return t('range-profile-type-1-and-2')
      case DiabeticType.DT1Pregnancy:
        return t('range-profile-pregnancy-type-1')
      case DiabeticType.Custom:
        return t('range-profile-custom')
    }
  }

  const chipConfig = getChipConfig(patient.diabeticProfile.type)

  return (
    <>
      <GenericListCard
        cardClassName={cards}
        cardHeaderClassName={cardsHeader}
        title={t('information')}
        tableLines={getTableProfileInformation()}
        data-testid="patient-profile-overview-section-information"
        headerAction={
          <ViewMoreLink dataTestId="link-patient-profile-info"
                        targetRoute= {`${urlPrefix}${AppUserRoute.PatientProfileInformationSection}`}/>
        }
      />

      <GenericListCard
        cardClassName={cards}
        cardHeaderClassName={cardsHeader}
        title={t('lead-clinicians')}
        tableLines={getTableLeadCliniciansInformation()}
        data-testid="patient-profile-overview-section-lead-clinicians"
        headerAction={
          <ViewMoreLink dataTestId="link-patient-profile-lead-clinicians"
                        targetRoute={`${urlPrefix}${AppUserRoute.PatientProfileLeadCliniciansSection}`}/>
        }
      />

      <GenericListCard
        cardClassName={cards}
        cardHeaderClassName={cardsHeader}
        title={`${t('range')} (${userBgUnit})`}
        data-testid="patient-profile-overview-section-range"
        headerAction={
          <ViewMoreLink dataTestId="link-patient-profile-range"
                        targetRoute= {`${urlPrefix}${AppUserRoute.PatientProfileRangeSection}`} />
        }
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center"
          }}
        >
          <Typography variant="body2">{t('patient-profile')}</Typography>
          <Chip
            label={chipConfig}
            sx={{
              color: 'var(--text-color-primary)',
              backgroundColor: 'var(--info-color-20)'
            }}
          />
        </Box>
      </GenericListCard>

      <GenericListCard
        cardClassName={cards}
        cardHeaderClassName={cardsHeader}
        title={`${t('alerts')} (${userBgUnit})`}
        data-testid="patient-profile-overview-section-alerts"
        headerAction={
          <ViewMoreLink dataTestId="link-patient-profile-alerts"
                        targetRoute= {`${urlPrefix}${AppUserRoute.PatientProfileAlertsSection}`} />
        }
      >
        <Typography variant="body2">{t('monitoring-alerts-configuration')}</Typography>
      </GenericListCard>
    </>
  )
}
