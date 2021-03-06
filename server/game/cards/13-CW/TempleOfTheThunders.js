const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Elements } = require('../../Constants');

const elementKeys = [
    'temple-of-the-thunders-fire-0',
    'temple-of-the-thunders-fire-1'
];

class TempleOfTheThunders extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.rings[this.getCurrentElementSymbol(elementKeys[0])].isConsideredClaimed(),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        this.forcedReaction({
            title: 'Place one fate on the unclaimed ring',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source && context.game.rings[this.getCurrentElementSymbol(elementKeys[1])].isUnclaimed()
            },
            gameAction: AbilityDsl.actions.placeFateOnRing(context => ({ target: context.game.rings[this.getCurrentElementSymbol(elementKeys[1])] }))
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKeys[0],
            prettyName: 'Strength Bonus',
            element: Elements.Fire
        });
        symbols.push({
            key: elementKeys[1],
            prettyName: 'Fate Ring',
            element: Elements.Fire
        });
        return symbols;
    }
}

TempleOfTheThunders.id = 'temple-of-the-thunders';

module.exports = TempleOfTheThunders;
