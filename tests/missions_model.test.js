
describe('Total Price',()=>{
    it('Should return 1 if time=1 , priceHours=1 nmbreJour=1',()=>{
      function calculTotalPrice(time,priceHours,nmbreJour){
            return (time*priceHours) *nmbreJour;
        
        }
        const result =calculTotalPrice(1,1,1);

        expect(result).toBe(1);

    });
});
