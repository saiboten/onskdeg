import reducer from './purchase';

describe('SET_USER_PURCHASES', () => {
    it('should update correctly', () => {
        const newState = reducer(undefined, {
            type: 'SET_USER_PURCHASES',
            uid: '123',
            purchases: {
                ['item1']: {
                    checked: true,
                    checkedby: 'Jens'
                }
            }
        })

        expect(newState.loading).toBe(false);
        expect(newState.purchases['123']['item1'].checked).toBe(true);
        expect(newState.purchases['123']['item1'].checkedby).toBe('Jens');
    })
})