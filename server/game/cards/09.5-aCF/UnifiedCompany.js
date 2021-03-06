const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Players, Locations } = require('../../Constants');

class UnifiedCompany extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put a 2 cost or less bushi into play from dynasty discard',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller &&
                        context.source.isParticipating() &&
                        context.player.opponent &&
                        context.player.hand.size() < context.player.opponent.hand.size();
                }
            },
            gameAction: AbilityDsl.actions.selectCard(() => ({
                cardType: CardTypes.Character,
                location: Locations.DynastyDiscardPile,
                controller: Players.Self,
                cardCondition: (card) => {
                    return card.hasTrait('bushi') &&
                        card.costLessThan(3) &&
                        !card.isUnique();
                },
                gameAction: AbilityDsl.actions.putIntoPlay()
            }))
        });
    }
}

UnifiedCompany.id = 'unified-company';

module.exports = UnifiedCompany;
