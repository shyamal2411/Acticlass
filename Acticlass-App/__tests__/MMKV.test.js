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
        it('should set a string value', () => {
            mmkv.set('str', 'hello');
            expect(mmkv.getString('str')).toBe('hello');
        });

        it('should set an object value', () => {
            const obj = { name: 'John', age: 30 };
            mmkv.set('obj', obj);
            expect(mmkv.getObject('obj')).toEqual(obj);
        });

        it('should set an array value', () => {
            const arr = [1, 2, 3];
            mmkv.set('arr', arr);
            expect(mmkv.getArray('arr')).toEqual(arr);
        });

        it('should set a number value', () => {
            mmkv.set('num', 123);
            expect(mmkv.getNumber('num')).toBe(123);
        });

        it('should set a boolean value', () => {
            mmkv.set('bool', true);
            expect(mmkv.getBoolean('bool')).toBe(true);
        });

        it('should set a null value', () => {
            mmkv.set('null', null);
            expect(mmkv.getObject('null')).toBeNull();
        });

        it('should set an undefined value', () => {
            mmkv.set('undefined', undefined);
            expect(mmkv.getObject('undefined')).toBeUndefined();
        });
    });

    describe('get', () => {
        it('should get a string value', () => {
            mmkv.set('str', 'hello');
            expect(mmkv.getString('str')).toBe('hello');
        });

        it('should get an object value', () => {
            const obj = { name: 'John', age: 30 };
            mmkv.set('obj', obj);
            expect(mmkv.getObject('obj')).toEqual(obj);
        });

        it('should get an array value', () => {
            const arr = [1, 2, 3];
            mmkv.set('arr', arr);
            expect(mmkv.getArray('arr')).toEqual(arr);
        });

        it('should get a number value', () => {
            mmkv.set('num', 123);
            expect(mmkv.getNumber('num')).toBe(123);
        });

        it('should get a boolean value', () => {
            mmkv.set('bool', true);
            expect(mmkv.getBoolean('bool')).toBe(true);
        });

        it('should get a null value', () => {
            mmkv.set('null', null);
            expect(mmkv.getObject('null')).toBeNull();
        });

        it('should get an undefined value', () => {
            mmkv.set('undefined', undefined);
            expect(mmkv.getObject('undefined')).toBeUndefined();
        });
    });

    describe('remove', () => {
        it('should remove a key', () => {
            mmkv.set('key', 'value');
            mmkv.remove('key');
            expect(mmkv.has('key')).toBe(false);
        });

        it('should not remove a non-existent key', () => {
            mmkv.remove('key');
            expect(mmkv.has('key')).toBe(false);
        });
    });

    describe('has', () => {
        it('should return true if key exists', () => {
            mmkv.set('key', 'value');
            expect(mmkv.has('key')).toBe(true);
        });

        it('should return false if key does not exist', () => {
            expect(mmkv.has('key')).toBe(false);
        });
    });

    describe('getAllKeys', () => {
        it('should return all keys', () => {
            mmkv.set('key1', 'value1');
            mmkv.set('key2', 'value2');
            expect(mmkv.getAllKeys()).toEqual(['key1', 'key2']);
        });

        it('should return an empty array if no keys exist', () => {
            expect(mmkv.getAllKeys()).toEqual([]);
        });
    });

    describe('clearAll', () => {
        it('should clear all keys', () => {
            mmkv.set('key1', 'value1');
            mmkv.set('key2', 'value2');
            mmkv.clearAll();
            expect(mmkv.getAllKeys()).toEqual([]);
        });

        it('should not throw an error if no keys exist', () => {
            expect(() => mmkv.clearAll()).not.toThrow();
        });
    });

    describe('addListener', () => {
        it('should call listener when value changes', () => {
            const listener = jest.fn();
            mmkv.addListener(listener);
            mmkv.set('key', 'value');
            expect(listener).toHaveBeenCalledWith('key');
        });

        it('should throw an error if callback is not provided', () => {
            expect(() => mmkv.addListener()).toThrowError(
                '[MMKVManager]: Callback is required'
            );
        });
    });
});