import { PersistentModel } from '@aws-amplify/datastore';
import { CommonSQLiteDatabase, ParameterizedStatement } from '../common/types';
declare class SQLiteDatabase implements CommonSQLiteDatabase {
    private db;
    init(): Promise<void>;
    createSchema(statements: string[]): Promise<void>;
    clear(): Promise<void>;
    get<T extends PersistentModel>(statement: string, params: (string | number)[]): Promise<T>;
    getAll<T extends PersistentModel>(statement: string, params: (string | number)[]): Promise<T[]>;
    save(statement: string, params: (string | number)[]): Promise<void>;
    batchQuery<T = any>(queryParameterizedStatements: Set<ParameterizedStatement>): Promise<T[]>;
    batchSave(saveParameterizedStatements: Set<ParameterizedStatement>, deleteParameterizedStatements?: Set<ParameterizedStatement>): Promise<void>;
    selectAndDelete<T = any>(queryParameterizedStatement: ParameterizedStatement, deleteParameterizedStatement: ParameterizedStatement): Promise<T[]>;
    private executeStatements;
    private closeDB;
}
export default SQLiteDatabase;
