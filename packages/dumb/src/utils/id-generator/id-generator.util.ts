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

/**
 * Interface for data items with required ID field
 */
interface HasId {
  id: string
}

/**
 * Interface for data items with optional GUID field
 */
interface MayHaveGuid extends HasId {
  guid?: string
}

/**
 * ID generator for creating consistent element IDs across plot methods
 */
export interface IdGenerator {
  /**
   * Generate a group ID for the main container element
   * @param d - The data item
   * @returns The generated group ID
   */
  groupId: (d: HasId) => string

  /**
   * Generate an element ID for a specific child element
   * @param d - The data item
   * @param elementType - The type of element (e.g., 'circle', 'rect', 'image', 'text')
   * @returns The generated element ID
   */
  elementId: (d: HasId, elementType: string) => string

  /**
   * Generate a test ID for automated testing
   * @param d - The data item (may have guid or just id)
   * @param elementType - The type of element (defaults to 'group')
   * @returns The generated test ID
   */
  testId: (d: MayHaveGuid, elementType?: string) => string

  /**
   * Generate a CSS selector for the group
   * @returns The CSS selector string
   */
  groupSelector: () => string

  /**
   * The prefix used for ID generation
   */
  readonly prefix: string
}

/**
 * Create an ID generator with consistent naming patterns
 *
 * @param prefix - The prefix to use for all generated IDs (e.g., 'nightMode', 'zenMode')
 * @returns An object with methods to generate consistent IDs
 *
 * @example
 * ```typescript
 * const idGen = createIdGenerator('nightMode')
 *
 * // Generate IDs
 * const groupId = idGen.group(data)           // 'nightMode_group_abc123'
 * const circleId = idGen.element(data, 'circle') // 'nightMode_circle_abc123'
 * const testId = idGen.testId(data)           // 'nightMode_group_guid-xyz' or 'nightMode_group_abc123'
 * const selector = idGen.groupSelector()      // 'd3-nightMode-group'
 * ```
 */
export const createIdGenerator = (prefix: string): IdGenerator => {
  return {
    prefix,
    groupId: (d: HasId): string => `${prefix}_group_${d.id}`,
    elementId: (d: HasId, elementType: string): string => `${prefix}_${elementType}_${d.id}`,
    testId: (d: MayHaveGuid, elementType: string = 'group'): string =>
      `${prefix}_${elementType}_${d.guid ?? d.id}`,
    groupSelector: (): string => `d3-${prefix}-group`
  }
}

