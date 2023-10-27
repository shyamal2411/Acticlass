import { KVDB } from "../src/utils/MMKV";
const sym = Symbol('test');

describe('MMKVManager', () => {
    let mmkv;

    beforeEach(() => {
        mmkv = new KVDB("test");
    });

    afterEach(() => {
        mmkv.clearAll();
    });

    describe('set', () => {
        test('should set a string value', () => {
            mmkv.set('str', 'hello');
            expect(mmkv.getString('str')).toBe('hello');
        });

        test('should set an object value', () => {
            const obj = { name: 'John', age: 30 };
            mmkv.set('obj', obj);
            expect(mmkv.getObject('obj')).toEqual(obj);
        });

        test('should set an array value', () => {
            const arr = [1, 2, 3];
            mmkv.set('arr', arr);
            expect(mmkv.getArray('arr')).toEqual(arr);
        });

        test('should set a number value', () => {
            mmkv.set('num', 123);
            expect(mmkv.getNumber('num')).toBe(123);
        });

        test('should set a boolean value', () => {
            mmkv.set('bool', true);
            expect(mmkv.getBoolean('bool')).toBe(true);
        });

        test('should set a null value', () => {
            mmkv.set('null', null);
            expect(mmkv.getObject('null')).toBeNull();
        });

        test('should set an undefined value', () => {
            mmkv.set('undefined', undefined);
            expect(mmkv.getObject('undefined')).toBeUndefined();
        });
    });

    describe('get', () => {
        test('should get a string value', () => {
            mmkv.set('str', 'hello');
            expect(mmkv.getString('str')).toBe('hello');
        });

        test('should get an object value', () => {
            const obj = { name: 'John', age: 30 };
            mmkv.set('obj', obj);
            expect(mmkv.getObject('obj')).toEqual(obj);
        });

        test('should get an array value', () => {
            const arr = [1, 2, 3];
            mmkv.set('arr', arr);
            expect(mmkv.getArray('arr')).toEqual(arr);
        });

        test('should get a number value', () => {
            mmkv.set('num', 123);
            expect(mmkv.getNumber('num')).toBe(123);
        });

        test('should get a boolean value', () => {
            mmkv.set('bool', true);
            expect(mmkv.getBoolean('bool')).toBe(true);
        });

        test('should get a null value', () => {
            mmkv.set('null', null);
            expect(mmkv.getObject('null')).toBeNull();
        });

        test('should get an undefined value', () => {
            mmkv.set('undefined', undefined);
            expect(mmkv.getObject('undefined')).toBeUndefined();
        });
    });

    describe('remove', () => {
        test('should remove a key', () => {
            mmkv.set('key', 'value');
            mmkv.remove('key');
            expect(mmkv.has('key')).toBe(false);
        });

        test('should not remove a non-existent key', () => {
            mmkv.remove('key');
            expect(mmkv.has('key')).toBe(false);
        });
    });

    describe('has', () => {
        test('should return true if key exists', () => {
            mmkv.set('key', 'value');
            expect(mmkv.has('key')).toBe(true);
        });

        test('should return false if key does not exist', () => {
            expect(mmkv.has('key')).toBe(false);
        });
    });

    describe('getAllKeys', () => {
        test('should return all keys', () => {
            mmkv.set('key1', 'value1');
            mmkv.set('key2', 'value2');
            expect(mmkv.getAllKeys()).toEqual(['key1', 'key2']);
        });

        test('should return an empty array if no keys exist', () => {
            expect(mmkv.getAllKeys()).toEqual([]);
        });
    });

    describe('clearAll', () => {
        test('should clear all keys', () => {
            mmkv.set('key1', 'value1');
            mmkv.set('key2', 'value2');
            mmkv.clearAll();
            expect(mmkv.getAllKeys()).toEqual([]);
        });

        test('should not throw an error if no keys exist', () => {
            expect(() => mmkv.clearAll()).not.toThrow();
        });
    });

    describe('addListener', () => {
        test('should call listener when value changes', () => {
            const listener = jest.fn();
            mmkv.addListener(listener);
            mmkv.set('key', 'value');
            expect(listener).toHaveBeenCalledWith('key');
        });

        test('should throw an error if callback is not provided', () => {
            expect(() => mmkv.addListener()).toThrowError(
                '[MMKVManager]: Callback is required'
            );
        });
    });
});