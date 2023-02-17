/*
 * Copyright (c) 2023, Diabeloop
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

import { type MedicalReport, type MedicalReportWithIndex } from '../../../lib/medical-files/models/medical-report.model'

const getMedicalReportsOrderedByDate = (medicalReports: MedicalReport[]): Map<string, MedicalReportWithIndex[]> => {
  return medicalReports.sort((firstMedicalReport, secondMedicalReport) => {
    return firstMedicalReport.creationDate.localeCompare(secondMedicalReport.creationDate)
  }).reduce((medicalReportsOrderedByDate: Map<string, MedicalReportWithIndex[]>, medicalReport) => {
    const creationDate = medicalReport.creationDate.substring(0, 10)
    const medicalReportToAdd: MedicalReportWithIndex = {
      medicalReport
    }
    const isDateAlreadyIncluded = !!medicalReportsOrderedByDate.get(creationDate)
    if (isDateAlreadyIncluded) {
      const medicalReportsAtGivenDate = medicalReportsOrderedByDate.get(creationDate)
      medicalReportToAdd.index = medicalReportsAtGivenDate.length
      medicalReportsAtGivenDate.push(medicalReportToAdd)
      medicalReportsOrderedByDate.set(creationDate, medicalReportsAtGivenDate)
      return medicalReportsOrderedByDate
    }
    medicalReportsOrderedByDate.set(creationDate, [medicalReportToAdd])
    return medicalReportsOrderedByDate
  }, new Map())
}

export const getMedicalReportsToDisplay = (medicalReports?: MedicalReport[]): MedicalReportWithIndex[] => {
  if (!medicalReports) {
    return []
  }
  const medicalReportsOrdered: Map<string, MedicalReportWithIndex[]> = getMedicalReportsOrderedByDate(medicalReports)

  return Array.from(medicalReportsOrdered.values()).reduce((medicalReportsFlatten, medicalReports) => {
    medicalReportsFlatten.push(...medicalReports)
    return medicalReportsFlatten
  }, [])
}

export const getMedicalReportDate = (medicalReportWithIndex: MedicalReportWithIndex): string => {
  const index = medicalReportWithIndex.index
  const medicalReportDate = medicalReportWithIndex.medicalReport.creationDate.substring(0, 10)
  return index ? `${medicalReportDate}_${index}` : medicalReportDate
}
