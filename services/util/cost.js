export function calculateCost(storage) {
    const rate = storage <= 10 ? 4 : storage <= 100 ? 2 : 1 ;
    //Stripe expects us to provide the amount in pennies, so here is multiplying the result by 100
    return rate * storage * 100;
}
