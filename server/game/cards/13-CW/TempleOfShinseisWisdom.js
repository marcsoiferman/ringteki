const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Elements } = require('../../Constants');

const elementKeys = [
    'temple-of-shinsei-s-wisdom-void-0',
    'temple-of-shinsei-s-wisdom-void-1'
];

class TempleOfShinseisWisdom extends ProvinceCard {
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
            element: Elements.Void
        });
        symbols.push({
            key: elementKeys[1],
            prettyName: 'Fate Ring',
            element: Elements.Void
        });
        return symbols;
    }
}

TempleOfShinseisWisdom.id = 'temple-of-shinsei-s-wisdom';

module.exports = TempleOfShinseisWisdom;
