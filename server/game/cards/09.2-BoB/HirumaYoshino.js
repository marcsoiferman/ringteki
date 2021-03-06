const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class HirumaYoshino extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Contribute printed military skill',
            condition: context => context.game.isDuringConflict('military') && context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                cardCondition: card => card.isInConflictProvince() &&
                    card.printedMilitarySkill > 0,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    targetLocation: Locations.Provinces,
                    effect: [
                        AbilityDsl.effects.contributeToConflict((card, context) => context.player),
                        AbilityDsl.effects.changeContributionFunction(card => card.printedMilitarySkill)
                    ]
                })
            },
            effect: 'contribute {0}\'s printed {1} skill of {2} to their side of the conflict',
            effectArgs: context => ['military', context.target.printedMilitarySkill]
        });
    }
}

HirumaYoshino.id = 'hiruma-yoshino';

module.exports = HirumaYoshino;
