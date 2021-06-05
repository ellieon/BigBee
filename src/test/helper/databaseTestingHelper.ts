import * as DatabaseHelper from 'common/database'
import { ImportMock } from 'ts-mock-imports'
import * as sinon from 'sinon'

export let databaseHelperMock = sinon.createStubInstance(DatabaseHelper.DatabaseHelper)
export let dataBaseMock = ImportMock.mockStaticClass(DatabaseHelper, 'DatabaseHelper')
dataBaseMock.mock('getInstance', databaseHelperMock)
