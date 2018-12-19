import { CardGameAction, CardActionProperties } from "./CardGameAction";

import { Locations, CardTypes, EventNames } from '../Constants';
import AbilityContext = require("../AbilityContext");
import BaseCard = require('../basecard');
import Event = require('../Events/Event');

export interface CreateTokenProperties extends CardActionProperties {
}

export class CreateTokenAction extends CardGameAction {
    name = 'createToken';
    effect = 'create a token';
    targetType = [CardTypes.Character, CardTypes.Holding];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(!card.facedown || ![Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].includes(card.location)) {
            return false;
        } else if(!context.game.isDuringConflict('military')) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card: BaseCard, context: AbilityContext): Event {
        return super.createEvent(EventNames.Unnamed, { card: card, context: context }, () => {
            let token = context.game.createToken(card);
            card.owner.removeCardFromPile(card);
            context.refillProvince(card.owner, card.location);
            card.moveTo(Locations.RemovedFromGame);
            card.owner.moveCard(token, Locations.PlayArea);
            if(context.player.isAttackingPlayer()) {
                context.game.currentConflict.addAttacker(token);
            } else {
                context.game.currentConflict.addDefender(token);
            }
            context.source.delayedEffect(() => ({
                target: token,
                context: context,
                when: {
                    onConflictFinished: () => true
                },
                message: '{1} returns to the deep',
                gameAction: context.game.actions.discardFromPlay()
            }));
        });
    }
}
